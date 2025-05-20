import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../../components/forms/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/config";
import Loader from "../../../components/loader/loader";
import { toast } from "sonner";

export default function LoginPage() {
  const queryClient = useQueryClient();
  const forms = [
    { label: "Username", name: "username", type: "text" },
    { label: "Password", name: "password", type: "password" },
  ];
  const [credentials, setCredentials] = useState<Record<string, any>>({
    email: "",
    password: "",
  });
  const [hidePassword, setHidePassword] = useState(true);
  const handleChange = (e: any) =>
    setCredentials((data) => ({ ...data, [e.target.id]: e.target.value }));
  const { mutate: login, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await api.post("/auth/login", credentials);
        if (res.status == 200) {
          return res.data;
        }
      } catch (err: any) {
        throw err;
      }
    },
    onError: (err: any) => {
      err.response.status == 401 && toast.error(err.response.data.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return (
    <div className="py-8 px-8 md:p-0 min-h-dvh flex flex-col sm:px-16 md:flex-row">
      <div className="flex flex-col h-full flex-grow md:flex-grow-0 text-center items-center md:w-4/6 lg:w-1/2 md:px-16">
        <h1 className="font-semibold text-slate-800 text-3xl mt-32 md:mt-40">
          Sign In{" "}
        </h1>
        <p className="text-slate-500 mt-2">Sign In With Your Credentials</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="flex flex-col flex-grow pt-16 gap-3 w-full sm:px-12 md:px-0 lg:px-4 xl:px-12"
        >
          {forms.map((form, i) => (
            <Input
              name={form.name}
              value={credentials[form.name] || ""}
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
          <button
            type="submit"
            className="px-4 py-2 bg-[#18181B] text-white flex justify-center text-center rounded-lg mt-16 "
          >
            {isPending ? <Loader className="size-6" /> : "Submit"}
          </button>
          <p className="text-slate-600">
            Don't have a account?{" "}
            <Link to={"/auth/signup"} className="text-blue-500 font-medium">
              Register Now
            </Link>{" "}
          </p>
        </form>
      </div>
      <div className="max-md:hidden flex flex-col flex-grow items-end justify-between bg-[#18181B] px-8 py-6">
        <h1 className="text-white font-semibold text-2xl text-end max-lg:hidden">
          netters.
        </h1>
      </div>
    </div>
  );
}
