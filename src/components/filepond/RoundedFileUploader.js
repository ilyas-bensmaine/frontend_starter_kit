// ** React Imports
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// ** Reactstrap Imports
import { Alert, FormFeedback, FormText, Label } from "reactstrap";
// ** Third Party Imports
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

import { baseURL, withCredentialsFlag } from "@api/useAxiosAPI";
import axios from "axios";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "react-feather";
import { DevTool } from "@hookform/devtools";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
// import "./filepond.css";

// const INPUT_ORIGIN = 1 // added by user
// const LIMBO_ORIGIN = 2 // temporary server file
// const LOCAL_ORIGIN = 3 // existing server file

const RoundedFileUploader = ({ initFiles, acceptedFileTypes }) => {
  registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    // FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    // FilePondPluginImageCrop,
    // FilePondPluginImageResize,
    // FilePondPluginImageTransform,
    // FilePondPluginImageEdit
  );
  // ** hooks
  const { t } = useTranslation();
  const methods = useForm({ media_uuids: [] });
  // ** States
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initFilesState, setInitFilesState] = useState([]);
  // ** Effects
  useEffect(() => {
    const tmpArr = initFiles
      ? initFiles.map((item) => {
          return {
            source: item.uuid,
            options: {
              type: "local",
            },
          };
        })
      : [];
    setInitFilesState(tmpArr);
  }, []);
  // ** Function
  const handleFileProcessed = (error, file) => {
    if (!error) {
      // ** update the state
      setInitFilesState((prevState) => [...prevState, file]);
      // ** Form hook
      const tmpArr = methods.getValues("media_uuids");
      tmpArr.push(file.serverId);
      methods.setValue("media_uuids", tmpArr, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    }
  };
  const handleFileReverted = (file) => {
    // ** update the state
    setInitFilesState((prevState) => {
      const filtredState = prevState.filter(
        (item) => item.serverId !== file.serverId
      );
      return filtredState;
    });
    // ** Form hook
    const tmpArr = methods.getValues("media_uuids");
    const filtredArr = tmpArr.filter((item) => item !== file.serverId);
    methods.setValue("media_uuids", filtredArr, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: false,
    });
  };

  // ** Server Methods
  const handleProcess = async (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort
  ) => {
    // related to aborting the request
    const CancelToken = axios.CancelToken;
    const sourceToken = CancelToken.source();
    // set data
    const dataToUpload = new FormData();
    dataToUpload.append("file", file);
    try {
      const response = await axios({
        url: `${baseURL}/api/filepond/process`,
        method: "POST",
        data: dataToUpload,
        withCredentials: withCredentialsFlag,
        cancelToken: sourceToken.token,
        onUploadProgress: (e) => {
          progress(e.progress, e.loaded, e.total);
        },
      });
      load(response.data);
    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      } else {
        console.log(
          "Server side error while uploading the file:",
          thrown.message
        );
        error("Something went wrong with process function");
      }
    }
    return {
      abort: () => {
        sourceToken.cancel("Operation canceled by the user.");
        abort();
      },
    };
  };
  const handleLoad = async (source, load, error, progress, abort) => {
    // related to aborting the request
    const CancelToken = axios.CancelToken;
    const sourceToken = CancelToken.source();
    try {
      const response = await axios({
        url: `${baseURL}/api/filepond/load/${source}`,
        method: "GET",
        withCredentials: withCredentialsFlag,
        cancelToken: sourceToken.token,
        responseType: "blob",
        onDownloadProgress: (e) => {
          progress(e.progress, e.loaded, e.total);
        },
      });
      load(response.data);
    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      } else {
        console.log(
          "Server side error while uploading the file:",
          thrown.message
        );
        error("Something went wrong");
      }
    }
    return {
      abort: () => {
        sourceToken.cancel("Operation canceled by the user.");
        abort();
      },
    };
  };
  const handleRevert = async (uniqueFileId, load, error) => {
    try {
      await axios({
        url: `${baseURL}/api/filepond/revert/${uniqueFileId}`,
        method: "DELETE",
        withCredentials: withCredentialsFlag,
      });
    } catch (thrown) {
      console.log(
        "Server side error while reverting the file:",
        thrown.message
      );
      error("Something went wrong with the revert function");
    }
    load();
  };
  const handleRemove = async (source, load, error) => {
    try {
      // ** Remove file from server by passing media uuid
      // await axios({
      //     url: `${baseURL}/api/filepond/remove/${source}`,
      //     method: 'DELETE',
      //     withCredentials: withCredentialsFlag
      // })
      // ** update the state
      setInitFilesState((prevState) => {
        const filtredState = prevState.filter((item) => item.source !== source);
        return filtredState;
      });
      // ** Form hook
      const tmpArr = methods.getValues("media_uuids");
      const filtredArr = tmpArr.filter((item) => item !== source);
      methods.setValue("media_uuids", filtredArr, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    } catch (thrown) {
      console.log("Server side error while removing the file:", thrown.message);
      error("Something went wrong with the remove function");
    }
    // ** Commit
    load();
  };
  // ** Handling Errors functions
  const showErrorAlertWithTimeout = () => {
    setVisibleAlert(true);
    setTimeout(() => {
      setVisibleAlert(false);
    }, 3000);
  };
  const handleErrors = (error) => {
    console.log(error);
    setErrorMessage(error.main ?? error.body);
    showErrorAlertWithTimeout();
  };

  return (
    <Fragment>
      <DevTool control={methods.control} placement="top-left" />
      <Alert
        color="danger"
        isOpen={visibleAlert}
        toggle={() => setVisibleAlert(false)}
      >
        <div className="alert-body">
          <AlertCircle size={15} />
          <span className="ms-1">{errorMessage}</span>
        </div>
      </Alert>
      <Controller
        name="media_uuids"
        control={methods.control}
        render={({ field: { onBlur } }) => (
          <>
            <input onBlur={onBlur} hidden />
            <FilePond
              className="filepond"
              // { ...field }
              files={initFilesState}
              server={{
                process: (
                  fieldName,
                  file,
                  metadata,
                  load,
                  error,
                  progress,
                  abort
                ) =>
                  handleProcess(
                    fieldName,
                    file,
                    metadata,
                    load,
                    error,
                    progress,
                    abort
                  ),
                load: (source, load, error, progress, abort) =>
                  handleLoad(source, load, error, progress, abort),
                revert: (uniqueFileId, load, error) =>
                  handleRevert(uniqueFileId, load, error),
                remove: (source, load, error) =>
                  handleRemove(source, load, error),
              }}
              onprocessfile={(error, file) => handleFileProcessed(error, file)}
              onprocessfilerevert={(file) => handleFileReverted(file)}
              onerror={(error) => handleErrors(error)}
              credits={true}
              allowMultiple={false}
              allowReplace={true}
              // Images-preview
              allowImagePreview={true}
              imagePreviewHeight={200}
              // ImageCrop
            //   allowImageCrop={true}
            //   imageCropAspectRatio={"1:1"}
              // Image resize
            //   imageResizeTargetWidth={200}
            //   imageResizeTargetHeight={200}
              // Image edit
            //   allowImageEdit={true}
            //   stylePanelLayout={"compact circle"}
            //   styleLoadIndicatorPosition={"center bottom"}
            //   styleProgressIndicatorPosition={"right bottom"}
            //   styleButtonRemoveItemPosition={"left bottom"}
            //   styleButtonProcessItemPosition={"right bottom"}
              // Type validation
              allowFileTypeValidation={true}
              acceptedFileTypes={acceptedFileTypes}
              labelFileTypeNotAllowed={t("Fichier de type invalide !")}
              fileValidateTypeLabelExpectedTypes={"Excepts {allTypes}"}
              // Size validation
              allowFileSizeValidation={true}
              maxFileSize={1024 * 1024 * 50} // 50MB
              labelMaxFileSizeExceeded={t("Le fichier est trop volumineux")}
              labelMaxFileSize={t(
                "La taille maximale du fichier est {filesize}"
              )}
              // Labels
              labelIdle={t("Drag & Drop your files")}
              labelInvalidField={t("Field contains invalid files")}
              labelFileWaitingForSize={t("Waiting for size")}
              labelFileSizeNotAvailable={t("Size not available")}
              labelFileLoading={t("Loading")}
              labelFileLoadError={t("Error during load")}
              labelFileProcessing={t("Uploading")}
              labelFileProcessingComplete={t("Upload complete")}
              labelFileProcessingAborted={t("Upload cancelled")}
              labelFileProcessingError={t("Error during upload")}
              labelFileProcessingRevertError={t("Error during revert")}
              labelFileRemoveError={t("Error during remove")}
              labelTapToCancel={t("tap to cancel")}
              labelTapToRetry={t("tap to retry")}
              labelTapToUndo={t("tap to undo")}
              labelButtonRemoveItem={t("Remove")}
              labelButtonAbortItemLoad={t("Abort")}
              labelButtonRetryItemLoad={t("Retry")}
              labelButtonAbortItemProcessing={t("Cancel")}
              labelButtonUndoItemProcessing={t("Undo")}
              labelButtonRetryItemProcessing={t("Retry")}
              labelButtonProcessItem={t("Upload")}
            />
          </>
        )}
      ></Controller>
      {methods?.errors?.media_uuids && (
        <Alert color="danger">
          <span className="align-middle ms-25">
            <AlertCircle size={15} className="me-1" />
            {methods?.errors?.media_uuids.message}
          </span>
        </Alert>
      )}
    </Fragment>
  );
};

export default React.memo(RoundedFileUploader);
