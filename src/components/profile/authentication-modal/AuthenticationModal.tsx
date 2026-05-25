import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";

import type { AuthModalProps, AuthTab } from "./types";
import { AUTH_TAB } from "./types";
import {
  AUTH_COPY,
  AUTH_FIELDS,
  AUTH_HERO_ICON,
  AUTH_RULES,
  AUTH_TABS,
  EMPTY_FORM,
} from "./utils";
import { useApi } from "../../../hooks/useApi";
import { useFieldValidation } from "../../../hooks/useFieldValidation";
import { useAuthContext } from "../../../context/AuthContext";
import Modal from "../../common/modal/Modal";
import Tabs from "../../common/tabs/Tabs";
import Input from "../../common/input/Input";
import Button from "../../common/button/Button";
import Icon from "../../common/icon/Icon";

import styles from "./AuthenticationModal.module.scss";

const AuthenticationModal = ({ isOpen, onClose }: AuthModalProps) => {
  const navigate = useNavigate();
  const { login, register } = useAuthContext();
  const submitApi = useApi<void>();

  const [activeTab, setActiveTab] = useState<AuthTab>(AUTH_TAB.LOGIN);
  const [values, setValues] = useState(EMPTY_FORM);

  const rules = AUTH_RULES[activeTab];
  const { errors, validateFields, validateSingleField, clearAllErrors } =
    useFieldValidation(rules);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab(AUTH_TAB.LOGIN);
      setValues(EMPTY_FORM);
      clearAllErrors();
      submitApi.reset();
    }
  }, [isOpen]);

  const handleTabChange = (key: string) => {
    if (key === activeTab) return;
    setActiveTab(key as AuthTab);
    setValues(EMPTY_FORM);
    clearAllErrors();
    submitApi.reset();
  };

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) validateSingleField(field, value, values);
  };

  const handleFieldBlur = (field: string) => {
    validateSingleField(field, values[field], values);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateFields(values)) return;

    const result = await submitApi.execute(() =>
      activeTab === AUTH_TAB.LOGIN
        ? login(values.email.trim(), values.password)
        : register(values.name.trim(), values.email.trim(), values.password)
    );

    if (result !== null) {
      onClose();
      navigate("/profile");
    }
  };

  const fields = AUTH_FIELDS[activeTab];
  const copy = AUTH_COPY[activeTab];
  const submitLabel = useMemo(() => {
    if (submitApi.loading) return "Please wait...";
    return activeTab === AUTH_TAB.LOGIN ? "Login" : "Create account";
  }, [submitApi.loading, activeTab]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label="Authentication"
      size="medium">
      <div className={styles.auth}>
        <header className={styles.auth__hero}>
          <span className={styles.auth__badge}>
            <Icon src={AUTH_HERO_ICON} size={22} />
          </span>
          <div className={styles.auth__heading}>
            <h2 className={styles.auth__title}>{copy.title}</h2>
            <p className={styles.auth__subtitle}>{copy.subtitle}</p>
          </div>
        </header>

        <Tabs
          items={AUTH_TABS}
          activeKey={activeTab}
          onChange={handleTabChange}
          label="Authentication mode"
        />

        <form className={styles.auth__form} onSubmit={handleSubmit} noValidate>
          <div className={styles.auth__fields}>
            {fields.map((field) => (
              <Input
                key={field.key}
                name={field.key}
                label={field.label}
                type={field.type}
                value={values[field.key]}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                caption={field.caption}
                error={errors[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                onBlur={() => handleFieldBlur(field.key)}
              />
            ))}

            {submitApi.error && (
              <p className={styles.auth__error} role="alert">
                {submitApi.error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="large"
            disabled={submitApi.loading}>
            {submitLabel}
          </Button>
        </form>

        <footer className={styles.auth__footer}>
          {activeTab === AUTH_TAB.LOGIN ? (
            <p>
              New here?{" "}
              <button
                type="button"
                className={styles.auth__switch}
                onClick={() => handleTabChange(AUTH_TAB.SIGNUP)}>
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already cooking with us?{" "}
              <button
                type="button"
                className={styles.auth__switch}
                onClick={() => handleTabChange(AUTH_TAB.LOGIN)}>
                Log in instead
              </button>
            </p>
          )}
        </footer>
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
