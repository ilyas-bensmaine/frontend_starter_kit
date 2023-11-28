import React, { Fragment, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
// ** Custom Components
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import Avatar from "@components/avatar";
// ** Utils
import { selectThemeColors } from "@utils";
import classnames from "classnames";
// ** Third Party Components
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { mapSelectableData, translateAttribute } from "../../utility/Utils";
import { updateUser } from "../../api/profile/ProfileAPI";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getCarTypes } from "../../api/cars/CarTypesAPI";
import { getCarBrands } from "../../api/cars/CarBrandsAPI";
import { getPartCategories } from "../../api/parts/PartCategoriesAPI";
import { getUserProfessions } from "../../api/users/UserProfessionsAPI";
import { DevTool } from "@hookform/devtools";
import { useGetSelectableCarBrands, useGetSelectableCarTypes, useGetSelectablePartCategories, useGetSelectableUserProfessions } from "@src/api/SelectableDataAPI";
import { useUpdateUser } from "@src/api/users/UsersAPI";

const defaultValues = {
  profession: "",
  car_types: [],
  car_brands: [],
  part_categories: [],
};

export default function BusinessTap({ selectedUser }) {
  // ** Hook
  const { t } = useTranslation();
  // ** Form
  const FormSchema = yup.object().shape({
    car_types: yup
      .object()
      .shape({
        value: yup.string().required("Wilaya is required"),
        label: yup.string().required(),
      })
      .nullable(),
    car_brands: yup
      .array()
      .typeError("This field required")
      .of(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .compact((v) => !v.value)
      .required("required-field"),
    part_categories: yup
      .array()
      .typeError("This field required")
      .of(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .compact((v) => !v.value)
      .required("required-field"),
  });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(FormSchema) });
  // ** Effect
  useEffect(() => {
    reset({
      profession: selectedUser.user_profession_id,
      car_types: mapSelectableData(selectedUser?.car_types),
      car_brands: mapSelectableData(selectedUser?.car_brands),
      part_categories: mapSelectableData(selectedUser?.part_categories),
    });
  }, []);
  // ** Queries
  const getSelectableUserProfessions = useGetSelectableUserProfessions()
  const getSelectableCarTypes = useGetSelectableCarTypes()
  const getSelectableCarBrands = useGetSelectableCarBrands()
  const getSelectablePartCategories = useGetSelectablePartCategories()
  const updateUser = useUpdateUser()
  const userProfessionsQuery = useSWR("user_profession", getSelectableUserProfessions);
  const carTypesQuery = useSWR("car_types", getSelectableCarTypes);
  const carBrandsQuery = useSWR("car_brands", getSelectableCarBrands);
  const partCategoriesQuery = useSWR("part_categories", getSelectablePartCategories);
  // ** Mutations
  const updateUserMutation = useSWRMutation(
    `api/user/${selectedUser?.id}`,
    updateUser,
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
  // ** Submit
  const onSubmit = async (formData) => {
    const data = {
      profession: formData.profession,
      car_types: formData.car_types?.value,
      car_brands: formData.car_brands?.map((item) => {
        return item.value;
      }),
      part_categories: formData.part_categories?.map((item) => {
        return item.value;
      }),
    };
    await updateUserMutation.trigger({
      id: selectedUser?.id,
      data,
    });
  };

  const updatedSelectedUserProfession = (event) => {
    setValue("profession", event.target.value);
  };
  const CarBrandOptionsComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <Avatar size="sm" img={data.logo} className="me-50" />
        {data.label}
      </components.Option>
    );
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{t("Infos sur la spécialité")}</CardTitle>
        </CardHeader>
        <CardBody>
          <DevTool control={control} placement="top-left" />{" "}
          {/* set up the dev tool */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} className="mb-1">
              <Row className="custom-options-checkable">
                {userProfessionsQuery?.data?.map((item) => {
                  return (
                    <Col md={4} className="mb-md-0 mb-2" key={item.name}>
                      <Input
                        type="radio"
                        id={item.name}
                        value={item.id}
                        name="profession"
                        onChange={updatedSelectedUserProfession}
                        className="custom-option-item-check"
                        defaultChecked={
                          item.id === selectedUser.user_profession_id
                        }
                      />
                      <label
                        className="custom-option-item px-2 py-1"
                        htmlFor={item.name}
                      >
                        <span className="d-flex align-items-center mb-50">
                          <FeatherIcon icon={item.icon} className="me-1" />
                          <span className="custom-option-item-title h4 fw-bolder mb-0">
                            {translateAttribute(item.name, item.arabic_name)}
                          </span>
                        </span>
                        <span className="d-block">
                          {translateAttribute(
                            item.description,
                            item.arabic_description
                          )}
                        </span>
                      </label>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="car_types">
                {" "}
                {t("Type de véhicules")}{" "}
              </Label>
              <Controller
                control={control}
                id="car_types"
                name="car_types"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      "is-invalid": errors?.car_types,
                    })}
                    classNamePrefix="select"
                    options={mapSelectableData(carTypesQuery?.data)}
                    isClearable={false}
                    value={field.value.length !== 0 ? field.value[0] : null}
                    isLoading={carTypesQuery?.isLoading}
                    {...field}
                  />
                )}
              />
              {errors.car_types?.value && (
                <FormFeedback>{errors.car_types?.value.message}</FormFeedback>
              )}
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="wilaya">
                {t("Marques de véhicules")}
              </Label>
              <Controller
                control={control}
                name="car_brands"
                render={({ field }) => (
                  <Select
                    isMulti
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      "is-invalid": errors?.car_brands,
                    })}
                    classNamePrefix="select"
                    options={mapSelectableData(carBrandsQuery?.data)}
                    components={{
                      Option: CarBrandOptionsComponent,
                    }}
                    isClearable={false}
                    value={field.value}
                    isLoading={carBrandsQuery?.isLoading}
                    {...field}
                  />
                )}
              />
              {errors.car_brands?.value && (
                <FormFeedback>{errors.car_brands?.value.message}</FormFeedback>
              )}
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="part_categories">
                {t("Catégories de pièces")}
              </Label>
              <Controller
                control={control}
                name="part_categories"
                render={({ field }) => (
                  <Select
                    isMulti
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      "is-invalid": errors?.part_categories,
                    })}
                    classNamePrefix="select"
                    options={mapSelectableData(partCategoriesQuery?.data)}
                    isClearable={false}
                    value={field.value}
                    {...field}
                    isLoading={partCategoriesQuery?.isLoading}
                  />
                )}
              />
              {errors.part_categories?.value && (
                <FormFeedback>
                  {errors.part_categories?.value.message}
                </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Button
                type="submit"
                color="primary"
                disabled={updateUserMutation?.isMutating}
              >
                {updateUserMutation?.isMutating ? (
                  <Spinner color="light" size="sm" />
                ) : (
                  t("Sauvgarder")
                )}
              </Button>
            </Col>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}
