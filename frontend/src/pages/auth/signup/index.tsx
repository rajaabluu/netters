import { ChangeEvent, useState } from "react";
import Input from "../../../components/forms/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/config";
import Loader from "../../../components/loader/loader";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const queryClient = useQueryClient();
  const forms = [
    { label: "Name", name: "name", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  const [credentials, setCredentials] = useState<Record<string, any>>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<any>();

  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((c) => ({ ...c, [id]: value }));
  };

  const handleSignUp = async () => {
    try {
      const res = await api.post("/auth/signup", credentials);
      if (res.status == 201) return res.data;
    } catch (err) {
      throw err;
    }
  };

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: handleSignUp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err: any) => {
      if (err.response.status == 422)
        setValidationErrors(err.response.data.errors);
    },
  });
  return (
    <div className="flex h-dvh">
      <div className="flex max-md:hidden md:flex-grow bg-[#18181B]"></div>
      <div className="flex flex-col justify-center h-dvh max-md:flex-grow md:w-2/3 px-[8%] sm:text-center sm:px-28 md:px-16 lg:px-12 xl:px-20 2xl:px-28 lg:w-1/2">
        <div className="-mt-8">
          <h1 className="font-semibold text-3xl text-slate-700">Sign Up</h1>
          <p className="text-slate-500">Create your account below.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUp();
          }}
          method="POST"
          className="flex flex-col  pt-16 gap-3 w-full lg:px-4 xl:px-12"
        >
          {forms.map((form, i) => (
            <Input
              {...(form.name == "username" && {
                onKeyDown: (e) => {
                  if (e.key == " ") e.preventDefault();
                },
              })}
              name={form.name}
              value={credentials[form.name]}
              type={
                form.name == "password"
                  ? hidePassword
                    ? form.type
                    : "text"
                  : form.type
              }
              key={i}
              placeholder={form.label}
              onChange={handleChange}
            >
              {form.name == "password" && (
                <div className="flex h-[2.6rem] max-w-20 max-h-20 absolute border border-l-0 border-slate-300 rounded-r-md right-0  top-0 z-[2]items-center pl-3 pr-4 bg-white">
                  <span
                    onClick={() => setHidePassword((h) => !h)}
                    className="p-1 h-full flex items-center pl-4 border-l border-slate-400 "
                  >
                    {hidePassword ? (
                      <EyeSlashIcon className="size-6" />
                    ) : (
                      <EyeIcon className="size-6" />
                    )}
                  </span>
                </div>
              )}
              {validationErrors?.[form.name] && (
                <small className="text-red-500 text-left w-full flex">
                  {validationErrors[form.name].message}
                </small>
              )}
            </Input>
          ))}
          <button className="py-2.5 px-5 bg-[#18181B] rounded-md text-white mt-8 flex justify-center">
            {isPending ? <Loader className="size-6" /> : "Sign Up"}
          </button>
          <p className="text-slate-600">
            Already have a account?{" "}
            <Link className="text-blue-500 font-medium" to={"/auth/login"}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
