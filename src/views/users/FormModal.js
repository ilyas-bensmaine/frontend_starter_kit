// ** React Imports
import { Fragment, useContext, useEffect } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback,
  Spinner,
  InputGroupText,
  InputGroup,
} from "reactstrap";
// ** Third Party Components
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import Select from "react-select";
import { DevTool } from "@hookform/devtools";
// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import classNames from "classnames";
// ** Utils
import { mapSelectableData, selectThemeColors } from "@utils";
import { ThemeColors } from "@utility/context/ThemeColors";
import { useTranslation } from "react-i18next";
import { usersDefaultValues, usersValidationSchema } from "./DefaultValues";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSelector } from "react-redux";
import Cleave from "cleave.js/react";
import ModalSpinner from "@myComponents/ModalSpinner";
import { useGetSelectableUserProfessions, useGetSelectableUserStatuses, useGetSelectableWilayas } from "@src/api/SelectableDataAPI";
import { useAddUser, useGetUserForEdit, useUpdateUser } from "@src/api/users/UsersAPI";

export const UsersEditModal = ({ id, formAction, openModal, toggleModal }) => {
  // ** stores
  const sortParams = useSelector((state) => state?.users?.sortParams);
  const filterParams = useSelector((state) => state?.users?.filterParams);
  // ** Context
  const { colors } = useContext(ThemeColors);
  // ** Hooks
  const { t } = useTranslation();
  const {
    control,
    reset,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: usersDefaultValues(null),
    mode: "all",
    resolver: yupResolver(usersValidationSchema()),
  });
  // ** Queries
  const getSelectableUserProfessions = useGetSelectableUserProfessions()
  const getSelectableUserStatuses = useGetSelectableUserStatuses()
  const getSelectableWilayas = useGetSelectableWilayas()
  const getUserForEdit = useGetUserForEdit()
  const addUser = useAddUser()
  const updateUser = useUpdateUser()
  const professionsQuery = useSWR(
    "selecatable_user_professions",
    getSelectableUserProfessions
  )
  const statusesQuery = useSWR(
    "selecatable_user_statuses",
    getSelectableUserStatuses
  )
  const wilayasQuery = useSWR("selecatable_wilayas", getSelectableWilayas);
  const recordQuery = useSWR(
    id ? `users/${id}/edit` : null,
    () => getUserForEdit(id),
    {
      onSuccess: (data) => {
        reset(usersDefaultValues(data))
      }
    }
  );
  // ** Effects
  useEffect(() => {
    if (formAction === "add") {
      reset();
    }
  }, [id]);
  // ** Mutations
  const addUserMutation = useSWRMutation(
    ["users", sortParams, filterParams],
    addUser,
    {
      onSuccess: () => {
        toast.success(t("Enregistrement ajouté avec succès !"));
        toggleModal();
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          const validitionErrors = error.response.data.errors;
          for (const key in validitionErrors) {
            setError(key, {
              type: "server",
              message: validitionErrors[key],
            });
          }
        } else {
          toast.error(t("Quelque chose n'a pas fonctioné !"));
          throw error;
        }
      },
    }
  );
  const updateUserMutation = useSWRMutation(
    ["users", sortParams, filterParams],
    updateUser,
    {
      onSuccess: () => {
        toast.success(t("Enregistrement modifié avec succès !"), {
          iconTheme: { primary: colors.primary.main },
        });
        toggleModal();
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          const validitionErrors = error.response.data.errors;
          for (const key in validitionErrors) {
            setError(key, {
              type: "server",
              message: validitionErrors[key],
            });
          }
        } else {
          toast.error(t("Quelque chose n'a pas fonctioné !"));
          throw error;
        }
      },
    }
  );
  // ** Submit
  const onSubmit = (formData) => {
    const data = {
      ...formData,
      phone: String("+213" + formData.phone?.replace(/\s/g, "")),
    };
    try {
      if (formAction === "add") {
        addUserMutation.trigger(data);
      }
      if (formAction === "update") {
        updateUserMutation.trigger({
          id,
          data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ** Func
  const handleModalClosed = () => {
    reset();
  };
  return (
    <Fragment>
      <DevTool control={control} placement="top-left" />
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        onClosed={handleModalClosed}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={toggleModal}
        ></ModalHeader>
        {recordQuery?.isLoading ? (
          <ModalSpinner />
        ) : (
          <ModalBody className="px-sm-5 mx-50 pb-5">
            <div className="text-center mb-2">
              {formAction === "add" && (
                <h1 className="mb-1">
                  {t("Ajouter un nouveau enregistrement")}
                </h1>
              )}
              {formAction === "update" && (
                <h1 className="mb-1">{t("Modifier cet enregistrement")}</h1>
              )}
            </div>
            <FormProvider
              control={control}
              reset={reset}
              handleSubmit={handleSubmit}
              setError={setError}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
            >
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row className="pt-75">
                  <Col md={6} xs={12}>
                    <Label className="form-label" for="name">
                      {t("Nom et prénom en français")}{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => {
                        return (
                          <Input
                            id="name"
                            placeholder="..."
                            {...field}
                            invalid={errors.name && true}
                          />
                        );
                      }}
                    />
                    {errors.name && (
                      <FormFeedback>{errors.name.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md={6} xs={12}>
                    <Label className="form-label" for="arabic_name">
                      {t("Nom et prénom en arabe")}{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="arabic_name"
                      render={({ field }) => {
                        return (
                          <Input
                            id="arabic_name"
                            placeholder="..."
                            {...field}
                            invalid={errors.arabic_name && true}
                          />
                        );
                      }}
                    />
                    {errors.arabic_name && (
                      <FormFeedback>{errors.arabic_name.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row className="pt-75">
                  <Col md={6} xs={12}>
                    <Label className="form-label" for="email">
                      {t("Email")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => {
                        return (
                          <Input
                            id="email"
                            placeholder="..."
                            {...field}
                            invalid={errors.email && true}
                          />
                        );
                      }}
                    />
                    {errors.email && (
                      <FormFeedback>{errors.email.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md={6} xs={12}>
                    <Label className="form-label" for="phone">
                      {t("Numéro de téléphone")}
                    </Label>
                    <InputGroup
                      className={classNames("input-group-merge", {
                        "is-invalid": errors?.phone,
                      })}
                      dir="ltr"
                    >
                      <InputGroupText>DZ (+213)</InputGroupText>
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                          <Cleave
                            className={classNames("form-control", {
                              "is-invalid": errors?.phone,
                            })}
                            placeholder="7 93 ** ** **"
                            // dir='ltr'
                            options={{
                              delimiter: "",
                              blocks: [1, 2, 2, 2, 2],
                            }}
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                      {errors.phone && (
                        <FormFeedback>{errors.phone.message}</FormFeedback>
                      )}
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="pt-75">
                  <Col md={4} xs={12}>
                    <Label className="form-label" for="profession">
                      {t("Profession")} <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="profession"
                      //eslint-disable-next-line
                      render={({ field }) => {
                        return (
                          <Select
                            placeholder={t("Choisir une valeur...")}
                            isClearable={true}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classNames("react-select", {
                              "is-invalid": errors?.profession,
                            })}
                            isLoading={professionsQuery.isLoading}
                            options={mapSelectableData(professionsQuery.data)}
                            {...field}
                          />
                        );
                      }}
                    />
                    {errors.profession && (
                      <FormFeedback>{errors.profession.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md={4} xs={12}>
                    <Label className="form-label" for="status">
                      {t("Status")} <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="status"
                      //eslint-disable-next-line
                      render={({ field }) => {
                        return (
                          <Select
                            placeholder={t("Choisir une valeur...")}
                            isClearable={true}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classNames("react-select", {
                              "is-invalid": errors?.status,
                            })}
                            isLoading={statusesQuery.isLoading}
                            options={mapSelectableData(statusesQuery.data)}
                            {...field}
                          />
                        );
                      }}
                    />
                    {errors.status && (
                      <FormFeedback>{errors.status.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md={4} xs={12}>
                    <Label className="form-label" for="wilaya">
                      {t("Wilaya")} <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="wilaya"
                      //eslint-disable-next-line
                      render={({ field }) => {
                        return (
                          <Select
                            placeholder={t("Choisir une valeur...")}
                            isClearable={true}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classNames("react-select", {
                              "is-invalid": errors?.wilaya,
                            })}
                            isLoading={wilayasQuery.isLoading}
                            options={mapSelectableData(wilayasQuery.data)}
                            {...field}
                          />
                        );
                      }}
                    />
                    {errors.wilaya && (
                      <FormFeedback>{errors.wilaya.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
                {/* buttons row */}
                <Col xs={12} className="text-center mt-2 pt-75">
                  {formAction === "add" && (
                    <Button
                      type="submit"
                      className="me-1"
                      color="success"
                      disabled={addUserMutation.isMutating}
                    >
                      {addUserMutation.isMutating ? (
                        <Spinner color="light" size="sm" />
                      ) : (
                        t("Enregister")
                      )}
                    </Button>
                  )}
                  {formAction === "update" && (
                    <Button
                      type="submit"
                      className="me-1"
                      color="primary"
                      disabled={updateUserMutation.isMutating}
                    >
                      {updateUserMutation.isMutating ? (
                        <Spinner color="light" size="sm" />
                      ) : (
                        t("Modifier")
                      )}
                    </Button>
                  )}
                  <Button
                    type="reset"
                    color="secondary"
                    outline
                    onClick={toggleModal}
                  >
                    {t("Annuler")}
                  </Button>
                </Col>
              </Row>
            </FormProvider>
          </ModalBody>
        )}
      </Modal>
    </Fragment>
  );
};

export default UsersEditModal;
