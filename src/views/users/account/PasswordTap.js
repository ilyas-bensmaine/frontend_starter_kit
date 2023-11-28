import React, { Fragment } from "react";

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
  Row,
  Spinner,
} from "reactstrap";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { updatePassword } from "@api/profile/ProfileAPI";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useSWRMutation from "swr/mutation";

const defaultValues = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function PasswordTab({ selectedUser }) {
  // ** Hook
  const { t } = useTranslation();
  // ** Form
  const FormSchema = yup.object().shape({
    current_password: yup.string().required(t("Ce champ est obligatoire")),
    password: yup.string().required(t("Ce champ est obligatoire")),
    password_confirmation: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        t("Les mots de passe doivent correspondre")
      ),
  });
  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(FormSchema) });
  // ** Mutations
  const updatePasswordMutation = useSWRMutation(
    `api/user/${selectedUser?.id}`,
    updatePassword,
    {
      onSuccess: () => {
        toast.success(t("Enregistrement modifié avec succès !"));
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
  const onSubmit = async (data) => {
    await updatePasswordMutation.trigger(data);
    reset(defaultValues);
  };
  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"> {t("Changer le mot de passe")} </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            {/* <Alert color='warning' className='mb-2'>
                            <h4 className='alert-heading'>Ensure that these requirements are met</h4>
                            <div className='alert-body'>Minimum 8 characters long, uppercase & symbol</div>
                        </Alert> */}
            <Row>
              <Col className="mb-2" md={12}>
                <Controller
                  id="current_password"
                  name="current_password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      label={t("Le mot de passe actuel")}
                      htmlFor="current_password"
                      className="input-group-merge"
                      invalid={errors.current_password && true}
                      {...field}
                    />
                  )}
                />
                {errors.current_password && (
                  <FormFeedback className="d-block">
                    {errors.current_password.message}
                  </FormFeedback>
                )}
              </Col>
              <Col className="mb-2" md={12}>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      label={t("Le nouveau mot de passe")}
                      htmlFor="password"
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback className="d-block">
                    {errors.password.message}
                  </FormFeedback>
                )}
              </Col>
              <Col className="mb-2" md={12}>
                <Controller
                  control={control}
                  id="password_confirmation"
                  name="password_confirmation"
                  render={({ field }) => (
                    <InputPasswordToggle
                      label={t("conformation du nouveau mot de passe")}
                      htmlFor="password_confirmation"
                      className="input-group-merge"
                      invalid={errors.password_confirmation && true}
                      {...field}
                    />
                  )}
                />
                {errors.password_confirmation && (
                  <FormFeedback className="d-block">
                    {errors.password_confirmation.message}
                  </FormFeedback>
                )}
              </Col>
              <Col xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={updatePasswordMutation?.isMutating}
                >
                  {updatePasswordMutation?.isMutating ? (
                    <Spinner color="light" size="sm" />
                  ) : (
                    t("Changer le mot de passe")
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}
