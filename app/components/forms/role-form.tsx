import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button, Checkbox, TextField } from "@mui/material";
import { useState } from "react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function RoleForm({
  initialData,
  onConfirm,
}: {
  closeForm: () => void;
  initialData?: {
    id: string;
    name: string;
    code: string;
    roles: string[];
  };
  onConfirm: (data: any) => Promise<void>;
}) {
  const trans = useAppSelector(getPageTrans("managersRolesPage")).popup;
  const [data, setData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    roles: initialData?.roles || ([] as string[]),
  });
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const handleData = (key: keyof typeof data, value: string) => {
    setData((prev) => {
      return { ...prev, [key]: value };
    });
  };
  const handleRoleToggle = (role: string) => {
    setData((prev) => {
      const alreadySelected = prev.roles.includes(role);
      return {
        ...prev,
        roles: alreadySelected ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
      };
    });
  };
  const validation = () => {
    const { name, code, roles } = data;
    if (name.trim().length < 3) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Name must be more than 2 character");
      return;
    }
    const codes = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
    if (!codes.includes(Number(code))) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "Code must be on of 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000"
      );
      return;
    }
    if (roles.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "You must pick atleast one attribute");
      return;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (loading) return;
    if (!validation()) return;
    setLoading(true);
    onConfirm(
      initialData
        ? {
            data: {
              roles: JSON.stringify(data.roles),
            },
            id: initialData?.id,
          }
        : {
            data: {
              ...data,
              roles: JSON.stringify(data.roles),
              code: Number(data.code),
            },
          }
    );
    setLoading(false);
  };
  return (
    <div className="w-xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit pb-2">
        {initialData ? trans.title.update : trans.title.create}
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <TextField
            className={`w-full`}
            value={data.name}
            onChange={(e) => handleData("name", e.target.value)}
            variant={"filled"}
            label={trans.inputs.name}
            disabled={!!initialData}
          />
          <TextField
            className={`w-full`}
            value={data.code}
            onChange={(e) => handleData("code", e.target.value)}
            variant={"filled"}
            label={trans.inputs.code}
            disabled={!!initialData}
          />
        </div>
        <div className="flex flex-col gap-1 my-3">
          <h1 className="text-black font-bold text-lg mx-auto">{trans.inputs.allRoles}</h1>
          <ul className="flex flex-wrap w-full max-h-[calc(100dvh-400px)] overflow-y-scroll">
            {roles.map((e, i) => (
              <li
                key={i}
                className="w-[50%] text-center font-[500] flex items-center text-black text-nowrap"
              >
                <Checkbox
                  {...label}
                  checked={data.roles.includes(e)}
                  onChange={() => handleRoleToggle(e)}
                />{" "}
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button onClick={handleConfirm} variant="contained">
        Confirm
      </Button>
    </div>
  );
}

const roles = [
  "create-tenant",
  "read-tenant",
  "update-tenant",

  "create-user",
  "read-user",
  "update-user",

  "create-role",
  "read-role",
  "update-role",

  "sub-complaint-f-client",
  "self-solve-complaint",
  "create-complaint",
  "read-complaint",
  "assign-complaint",
  "assignable",
  "update-complaint",
];
