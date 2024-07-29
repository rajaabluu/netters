import { useEffect, useState } from "react";
import Input from "../../../components/forms/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import api from "../../../api/config";
import Loader from "../../../components/loader/loader";

export default function SignUpPage() {
  const forms = [
    { label: "Username", name: "username", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  const [credentials, setCredentials] = useState<Record<string, any>>({
    username: "",
    email: "",
    password: "",
  });

  const [validationError, setValidationError] = useState({});

  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setCredentials((c) => ({ ...c, [id]: value }));
  };

  const handleSignUp = async () => {
    try {
      const res = await api.get("/auth/sign-up");
      if (res.status == 200) return res.data;
    } catch (err) {}
  };

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: handleSignUp,
    onSuccess: () => {},
  });

  useEffect(() => {
    console.log(credentials);
  }, [credentials]);

  return (
    <div className="flex h-screen">
      <div className="flex max-md:hidden md:flex-grow bg-[#18181B]"></div>
      <div className="flex flex-col max-md:flex-grow md:w-2/3 px-[8%] sm:text-center sm:px-28 md:px-16 lg:px-12 xl:px-20 2xl:px-28 lg:w-1/2">
        <div className="mt-44">
          <h1 className="font-semibold text-3xl text-slate-700">Sign Up</h1>
          <p className="text-slate-500">Create your account below.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUp();
          }}
          method="POST"
          className="flex flex-grow flex-col  pt-16 gap-3 w-full lg:px-4 xl:px-12"
        >
          {forms.map((form, i) => (
            <Input
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
                <div className="flex absolute border border-l-0 border-slate-300 rounded-r-md right-0 -translate-y-1/2 top-1/2 z-[2] h-full items-center pl-3 pr-4 bg-white">
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
            </Input>
          ))}
          <button className="py-2.5 px-5 bg-[#18181B] rounded-md text-white mt-8 flex justify-center">
            {isPending ? <Loader className="size-6" /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
