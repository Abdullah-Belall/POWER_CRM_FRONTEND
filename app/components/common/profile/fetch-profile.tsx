"use client";
import { getProfile } from "@/app/utils/requests/common.requests";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { setCurrentUser } from "@/app/utils/store/slices/user-slice";
import { useQuery } from "@tanstack/react-query";

export default function FetchProfile() {
  const dispatch = useAppDispatch();
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await getProfile();
      console.log(result.data);
      dispatch(setCurrentUser(result.data));
      return result.data;
    },
  });
  return <></>;
}
