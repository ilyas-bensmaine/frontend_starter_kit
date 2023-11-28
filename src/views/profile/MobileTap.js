import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
// ** Custom Components
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Cleave from "cleave.js/react";
// ** Utils
import classnames from "classnames";
// ** Firebase phone auth
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Check, Lock } from "react-feather";
// ** Utils
import firebaseApp from "../../firebase-config";
import {
  handleErrorAlert,
  handleSuccessAlert,
} from "../../utility/GlobalAlrets";
import { useTranslation } from "react-i18next";

export default function MobileTap({ selectedUser }) {
  const defaultValues = {
    phone: selectedUser.phone.substr(4),
    OTP: "",
  };
  // ** firebase
  const auth = getAuth();
  // ** Hooks
  const { t } = useTranslation();
  // ** States
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [isRequestedOTP, setIsRequestedOTP] = useState(false);
  // ** Effect
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log(response);
        },
      }
    );
  }, []);
  // ** Form Hook
  const FormSchema = yup.object().shape({
    phone: yup
      .string()
      .required(t("Ce champ est obligatoire"))
      .matches(
        /^((5|6|7) [0-9][0-9] [0-9][0-9] [0-9][0-9] [0-9][0-9])$/,
        t("invalid phone number format")
      ),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(FormSchema) });
  // ** Submit
  const handleRequestOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      .then((ConfirmationResulat) => {
        window.confirmationResulat = ConfirmationResulat;
        setIsRequestedOTP(true);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const OTPUpdated = (event) => {
    setValue("OTP", event.target.value);
    if (getValues("OTP").length === 6) {
      // eslint-disable-next-line
      window.confirmationResulat
        ?.confirm(getValues("OTP"))
        .then(async (result) => {
          try {
            handleSuccessAlert("Good job !", "OTP code was correct.", () => {
              console.log("success");
            });
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          console.log(error);
          handleErrorAlert("Error !", "OTP code is incorrect.", () => {
            setError("OTP", "OTP code is incorrect");
          });
        });
    }
  };
  const onSubmit = async (data) => {
    try {
      handleRequestOTP();
      setOpenOTPModal(true);
    } catch (error) {
      if (error.response?.status === 422) {
        const validitionErrors = error.response.data.errors;
        for (const key in validitionErrors) {
          setError(key, {
            type: "server",
            message: validitionErrors[key],
          });
        }
      } else {
        console.log(error);
      }
    }
  };
  const phoneUpdated = (event) => {
    setValue("phone", event.target.value);
    if (
      getValues("phone").length < 13 ||
      getValues("phone").replace(/\s/g, "") === selectedUser.phone.substr(4)
    ) {
      setSubmitBtnDisabled(true);
    } else {
      setSubmitBtnDisabled(false);
    }
  };
  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Change Mobile Number</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Alert color="warning" className="mb-2">
              <h4 className="alert-heading">
              {t("S'assurer d'introduire le code de confirmation")}
              </h4>
              <div className="alert-body">
                {("Vous recevrez un code de confirmation juste après avoir appliqué les changements.")}
              </div>
            </Alert>
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="phone">
                  {("N° telephone")}
                </Label>
                <InputGroup className="input-group-merge">
                  <InputGroupText
                    className={classnames({ "is-invalid": errors?.phone })}
                  >
                    DZ (+213)
                  </InputGroupText>
                  <Controller
                    control={control}
                    id="phone"
                    name="phone"
                    // eslint-disable-next-line
                    render={({ field: { onChange, value } }) => (
                      <Cleave
                        className={classnames("form-control", {
                          "is-invalid": errors?.phone,
                        })}
                        onChange={phoneUpdated}
                        value={value}
                        options={{
                          delimiter: " ",
                          blocks: [1, 2, 2, 2, 2],
                        }}
                        dir="ltr"
                      />
                    )}
                  />
                  {errors.phone && (
                    <FormFeedback>{errors.phone.message}</FormFeedback>
                  )}
                </InputGroup>
              </Col>
              <Col xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={submitBtnDisabled}
                >
                  Save changes
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Modal
        isOpen={openOTPModal}
        toggle={() => setOpenOTPModal(!openOTPModal)}
        className="modal-dialog-centered modal-lg"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent"></ModalHeader>
        <ModalBody className="pb-5 px-sm-5 mx-50">
          <h1 className="text-center mb-2 pb-50">Verify Mobile Number </h1>
          <p>
            We sent a verification code via SMS to this mobile number{" "}
            {`+213 ${getValues("phone")}`}. Enter the code from the mobile in
            the field below.
          </p>
          <Row className="gy-1 mt-1">
            <Col xs={12}>
              <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                <InputGroup className="input-group-merge">
                  <InputGroupText
                    className={classnames({ "is-invalid": errors?.OTP })}
                  >
                    <Lock size={14} />
                  </InputGroupText>
                  <Controller
                    control={control}
                    id="OTP"
                    name="OTP"
                    // eslint-disable-next-line
                    render={({ field: { onChange, value } }) => (
                      <Input
                        autoFocus={isRequestedOTP}
                        // disabled={!isRequestedOTP}
                        className={classnames("form-control", {
                          "is-invalid": errors?.OTP,
                        })}
                        maxLength="6"
                        onChange={OTPUpdated}
                        value={value}
                      />
                    )}
                  />
                  {errors.OTP && (
                    <FormFeedback>{errors.OTP.message}</FormFeedback>
                  )}
                </InputGroup>
              </div>
              <p className="text-center mt-25">
                <span>Didn’t get the code?</span>{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Resend
                </a>{" "}
                <span>or</span>{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Call us
                </a>
              </p>
            </Col>
            <Col className="d-flex justify-content-end mt-3" xs={12}>
              <Button
                outline
                color="secondary"
                className="me-1"
                onClick={() => setOpenOTPModal(!openOTPModal)}
              >
                Discard
              </Button>
              <Button color="primary">
                <span className="me-50">Done</span>
                <Check className="rotate-rtl" size={14} />
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <div id="recaptcha-container"></div>
    </Fragment>
  );
}
