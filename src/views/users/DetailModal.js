import React from "react";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { translateAttribute } from "@configs/i18n";
import ModalSpinner from "@myComponents/ModalSpinner";
import { useGetUser } from "@src/api/users/UsersAPI";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

export default function UsersDetailModal({ id, openModal, toggleModal }) {
  // ** hooks
  const { t } = useTranslation()
  const navigate = useNavigate()
  // ** Queries
  const getUser = useGetUser()
  const { data, isLoading } = useSWR(id ? `users/${id}` : null, () => getUser(id))
  const SeeMore = () => {
    navigate(`/users/${id}/account`)
  }
  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader
        className="bg-transparent"
        toggle={toggleModal}
      ></ModalHeader>
      {isLoading ? (
        <ModalSpinner />
      ) : (
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <div className="text-center mb-2">
            <h1 className="mb-1">{t("Détails")}</h1>
          </div>
          <div className="info-container gy-1 pt-75">
            <ul className="list-unstyled">
              <li className="mb-75">
                <span className="fw-bolder me-25">
                  {t("Nom et prénom en français")} :
                </span>
                <span className="text-capitalize">{data?.name}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">
                  {t("Nom et prénom en arabe")} :
                </span>
                <span className="text-capitalize">{data?.arabic_name}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">
                  {t("Phone")} :
                </span>
                <span className="text-capitalize">{data?.phone}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">{t("Wilaya")} :</span>
                <span className="text-capitalize">
                  {translateAttribute(
                    data?.wilaya?.name,
                    data?.wilaya?.arabic_name
                  )}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">{t("Profession")} :</span>
                <span className="text-capitalize">
                  <Badge color={data?.profession?.tag_color}>
                    {translateAttribute(
                      data?.profession?.name,
                      data?.profession?.arabic_name
                    )}
                  </Badge>
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">{t("Etat")} :</span>
                <span className="text-capitalize">
                  <Badge color={data?.status?.tag_color}>
                    {translateAttribute(
                      data?.status?.name,
                      data?.status?.arabic_name
                    )}
                  </Badge>
                </span>
              </li>
              <li className="mb-75">
                <Row>
                  <Col md={6} sm={12}>
                    <span className="fw-bolder me-25">{t("Demandes")} :</span>
                    <span className="text-capitalize">{data?.posts_count}</span>
                  </Col>
                  <Col md={6} sm={12}>
                    <span className="fw-bolder me-25">{t("Réponses")} :</span>
                    <span className="text-capitalize">{data?.post_responses_count}</span>
                  </Col>
                </Row>
              </li>
            </ul>
          </div>
          <Col className="text-center" xs={12}>
            <Button
              type="submit"
              className="me-1 mt-2"
              color="secondary"
              onClick={SeeMore}
            >
              {t("Voir plus")}
            </Button>
            <Button
              type="reset"
              className="mt-2"
              color="secondary"
              outline
              onClick={toggleModal}
            >
              {t("Fermer")}
            </Button>
          </Col>
        </ModalBody>
      )}
    </Modal>
  );
}
