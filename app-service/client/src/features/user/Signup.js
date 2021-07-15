import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import styles from "./User.module.css";
import { useHistory } from "react-router-dom";
import { signupUser, selectStatus, clearState } from './userSlice';
import { useEffect } from "react";

export const Signup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
const { isFetching, isSuccess, isError, errorMessage } = useSelector(
  selectStatus
  );

  const onFinish = async (values) => {
    dispatch(signupUser( values ));
    // try {
    //   setLoading(true);
    //   await api.post("auth/signup/", { ...values });
    //   history.push("/");
    //   setLoading(false);
    // } catch (err) {
    //   setLoading(false);
    //   setError(err.response.data.message);
    // }
  };
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      history.push('/');
    }

    if (isError) {
      console.log(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);
  
  return (
    <div className={styles.center}>
      <Form
        name="normal_login"
        className={styles.loginForm}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className={styles.siteFormItemIcon} />}
            placeholder="Username"
          />
        </Form.Item>
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
            Register
          </Button>
        </Form.Item>
        {errorMessage && <Alert message={errorMessage} type="error" />}
      </Form>
    </div>
  );
};