"use client";
import { Button } from "@mui/material";
import SplitText from "./components/common/animated-text/split-text";
import { useAppSelector } from "./utils/store/hooks";
import { getCurrLang, getPageTrans } from "./utils/store/slices/languages-slice";

export default function Home() {
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("landingPage"));
  return (
    <section className="flex justify-between items-center mx-auto w-[95%] h-full">
      <div className="w-full flex flex-col gap-4 justify-center text-white">
        <div className="flex !text-start !text-nowrap flex-col justify-center font-bold text-7xl">
          <SplitText
            key={`${lang}-title-1`}
            text={trans.title[0]}
            className="!text-start !text-nowrap leading-22"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType={lang === "en" ? "chars" : "words"}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <SplitText
            key={`${lang}-title-2`}
            text={trans.title[1]}
            className=" !text-start !text-nowrap leading-23"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType={lang === "en" ? "chars" : "words"}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <SplitText
            key={`${lang}-title-3`}
            text={trans.title[2]}
            className=" !text-start !text-nowrap leading-22"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType={lang === "en" ? "chars" : "words"}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
        <p className="text-sm max-w-[430px]">{trans.body}</p>
        <div className="flex items-center gap-2">
          <Button className="!bg-lightgreen !text-white" variant="contained">
            {trans.btns.learnMore}
          </Button>
          <Button className="!bg-transparent !text-white !border border-white" variant="contained">
            {trans.btns.contactUs}
          </Button>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-end">
        <img
          className={`w-[95%] rounded-xl ${lang === "ar" && "scale-x-[-1]"}`}
          src="test/test3.jpg"
          alt=""
        />
      </div>
    </section>
  );
}
/*
(
  <div className="fixed left-0 top-0 w-full h-[100dvh] z-[-1] bg-white">
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "linear-gradient(to left, #092830 0%, #204E5D 100%)",
    }}
  >
  </div>
</div>
)
*/
