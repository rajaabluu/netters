import { useState } from "react";
import Input from "../../../components/forms/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

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

  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setCredentials((c) => ({ ...c, [id]: value }));
  };

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow">
        <div className="px-6 mt-28">
          <h1 className="font-semibold text-3xl text-slate-700">Sign Up</h1>
          <p className="text-slate-500">Create your account below.</p>
        </div>
        <form
          method="POST"
          className="flex flex-grow flex-col px-6  pt-16 gap-3 w-full sm:px-12 md:px-0 lg:px-4 xl:px-12"
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
        </form>
      </div>
    </div>
  );
}
