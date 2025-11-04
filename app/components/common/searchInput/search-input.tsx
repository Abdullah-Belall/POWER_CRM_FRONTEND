"use client";
import { CLIENT_COLLECTOR_REQ, COMMON_SEARCH } from "@/app/utils/requests-hub/common-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import {
  getSearchInfo,
  setSearchColumn,
  setSearchWith,
} from "@/app/utils/store/slices/search-slice";
import { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function SearchInput() {
  const trans = useAppSelector(getPageTrans("search"));
  const [dropDown, setDropDown] = useState(false);
  const { search_in, search_with, column, columns, fillFunc } = useAppSelector(getSearchInfo());
  const [debounce, setDebounce] = useState<NodeJS.Timeout | null>();
  const dispatch = useAppDispatch();
  const handleSearchWith = (value: string) => {
    if (!search_in) return;
    dispatch(
      setSearchWith({
        search_with: value,
      })
    );
  };
  const columnsView = useMemo(() => {
    dispatch(
      setSearchColumn({
        column: null,
      })
    );
    return columns.map((e, i, arr) => (
      <li
        key={i}
        onClick={() => {
          dispatch(
            setSearchColumn({
              column: e.slug as string,
            })
          );
          setDropDown(false);
        }}
        className={`w-full hover:bg-hovergreen py-1 font-bold ${
          i !== arr.length - 1 && "border-b"
        }`}
      >
        {e.slug}
      </li>
    ));
  }, [columns]);
  const handleSearch = (value: string) => {
    handleSearchWith(value);
    if (debounce) {
      clearTimeout(debounce);
    }
    const timer = setTimeout(async () => {
      const res = await CLIENT_COLLECTOR_REQ(COMMON_SEARCH, {
        body: {
          search_in,
          search_with: value,
          column: columns.find((e) => e.slug === column)?.alias ?? null,
          created_sort: "DESC",
        },
      });
      if (res.done) {
        fillFunc(res.data);
      }
    }, 500);
    setDebounce(timer);
  };
  useEffect(() => {
    if (search_in) {
      handleSearch(search_with);
    }
  }, [column]);
  return search_in ? (
    <label
      htmlFor="searchInput23"
      className="bg-lightgreen text-white rounded-md border-0 flex items-center w-fit py-1 px-1"
    >
      <input
        id="searchInput23"
        onChange={(e) => handleSearch(e.target.value)}
        className="outline-0 px-2 w-[65%] text-white caret-white"
        placeholder={trans.placeholder}
        value={search_with}
      />
      {columns?.length > 0 ? (
        <button
          onClick={() => setDropDown(!dropDown)}
          onBlur={() => setDropDown(false)}
          className="relative text-xs cursor-pointer w-[35%]"
        >
          <span className="flex justify-between items-center font-bold">
            {column ?? trans.selectCol}
            {dropDown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </span>

          <ul
            className={`${
              dropDown ? "h-fit" : "h-0"
            } max-h-[100px] duration-200 absolute w-full rounded-md overflow-x-hidden left-0 top-[25px] bg-lightgreen text-white shadow-md z-[9999]`}
          >
            {columnsView}
          </ul>
        </button>
      ) : (
        ""
      )}
    </label>
  ) : (
    ""
  );
}
