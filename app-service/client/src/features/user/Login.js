import { Form, Input, Button, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import styles from "./User.module.css";
import { useDispatch,useSelector } from "react-redux";
import { loginUser, userSelector, clearState, selectStatus } from './userSlice';
import { useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";

export const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(
    selectStatus
  );

  const onFinish = async (values) => {
    dispatch(loginUser(values));
    console.log(values)
    history.push("/");
    // try {
    //   setLoginRequestStatus("pending");
    //   const resultAction = await dispatch(loginUser(values));
    //   unwrapResult(resultAction);
    //   history.push("/");
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoginRequestStatus("idle");
    // }
  };
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
    }

    if (isSuccess) {
      dispatch(clearState());
      history.push('/');
    }
  }, [isError, isSuccess]);

  return (
    <div className={styles.center}>
      <Form
        name="normal_login"
        className={styles.loginForm}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
            {
              type: "email",
              message: "is not a valid email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className={styles.siteFormItemIcon} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className={styles.siteFormItemIcon} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.loginFormButton}
            loading={isFetching}
          >
            Log in
          </Button>
          Or <Link to={"/register"}>register now!</Link>
        </Form.Item>
        {errorMessage && <Alert message={errorMessage} type="error" />}
      </Form>
    </div>
  );
};