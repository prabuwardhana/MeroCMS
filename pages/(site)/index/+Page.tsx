import React from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";

export default function Page() {
  const { coverImageUrl, content } = useData<Data>();
  return (
    <main>
      <section className="grid grid-flow-row auto-rows-max text-center bg-slate-50">
        <div className="bg-gradient-to-b from-violet-200 to-slate-50 flex justify-center px-6 lg:px-0">
          <div className="prose lg:prose-lg prose-headings:my-0 prose-a:no-underline prose-a:text-violet-100 space-y-6">
            <div className="justify-center pt-20 lg:pb-20">
              <h1 className="text-violet-800 font-bold leading-tight">
                {content["Long-Text-With-Link-0"]["headline"]}
              </h1>
              <div>
                <p className="text-slate-800 text-lg">{content["Long-Text-With-Link-0"]["text-content"]}</p>
              </div>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white rounded-md">
                <a href={content["Long-Text-With-Link-0"]["link-url"]}>
                  {content["Long-Text-With-Link-0"]["link-text"]}
                </a>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-4 py-6 xl:p-0">
          <img
            width={"1200px"}
            height={"600px"}
            src={coverImageUrl}
            className="border-8 rounded-3xl border-white object-cover shadow-lg lg:-translate-y-[10%]"
          />
        </div>
      </section>
      <section className="flex justify-center px-10 pb-10 md:px-6 bg-slate-50">
        <div className="prose lg:prose-lg prose-headings:my-0 max-w-screen-lg space-y-8">
          <h2 className="text-center text-violet-800 leading-tight my-0 font-bold">How Mero CMS Helps You?</h2>
          <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-flow-row gap-4">
            <div className="space-y-2 p-8 rounded-md bg-gradient-to-br from-violet-200 to-violet-100">
              <h4 className="font-bold text-violet-800 leading-snug my-0">
                {content["Short-Text-Content-1"]["title"]}
              </h4>
              <p className="text-slate-800 text-sm">{content["Short-Text-Content-1"]["content"]}</p>
            </div>
            <div className="space-y-2 p-8 rounded-md bg-gradient-to-br from-violet-200 to-violet-100">
              <h4 className="font-bold text-violet-800 leading-snug my-0">
                {content["Short-Text-Content-2"]["title"]}
              </h4>
              <p className="text-slate-800 text-sm">{content["Short-Text-Content-2"]["content"]}</p>
            </div>
            <div className="space-y-2 p-8 rounded-md bg-gradient-to-br from-violet-200 to-violet-100">
              <h4 className="font-bold text-violet-800 leading-snug my-0">
                {content["Short-Text-Content-3"]["title"]}
              </h4>
              <p className="text-slate-800 text-sm">{content["Short-Text-Content-3"]["content"]}</p>
            </div>
            <div className="space-y-2 p-8 rounded-md bg-gradient-to-br from-violet-200 to-violet-100">
              <h4 className="font-bold text-violet-800 leading-snug my-0">
                {content["Short-Text-Content-4"]["title"]}
              </h4>
              <p className="text-slate-800 text-sm">{content["Short-Text-Content-4"]["content"]}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-center py-10 px-6 md:px-24 bg-slate-50">
        <div className="grid grid-flow-row auto-rows-min gap-y-6 lg:auto-cols-fr lg:grid-flow-col lg:gap-x-6 prose lg:prose-lg prose-headings:my-0 max-w-screen-lg">
          <div className="flex items-center justify-center">
            <img src={content["Image-With-Rich-Text-Content-6"]["image-content"]} className="object-cover p-10 my-0" />
          </div>
          <div className="flex flex-col justify-center space-y-4 lg:space-y-0">
            <h2 className="font-bold text-violet-800 leading-tight my-0">
              {content["Image-With-Rich-Text-Content-6"]["title"]}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: content["Image-With-Rich-Text-Content-6"]["text-content"] as string }}
              className="prose lg:prose-base prose-p:text-sm prose-p:lg:text-base prose-p:text-slate-800 prose-strong:text-slate-800"
            ></div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-br from-violet-200 to-pink-200 py-10 px-6 md:py-20 md:px-24">
        <div className="grid grid-flow-row auto-rows-min gap-y-6 lg:auto-cols-fr lg:grid-flow-col lg:gap-x-6">
          <div className="flex flex-col justify-center space-y-6 prose lg:prose-lg prose-headings:my-0 prose-a:no-underline prose-a:text-violet-100">
            <h2 className="font-bold text-violet-800 leading-snug my-0">
              {content["Image-Text-Link-Content-5"]["headline"]}
            </h2>
            <p className="text-slate-800 my-0 text-sm lg:text-base">
              {content["Image-Text-Link-Content-5"]["text-content"]}
            </p>
            <div>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-800 text-sm lg:text-base text-white rounded-md">
                <a href={content["Image-Text-Link-Content-5"]["link-url"]}>
                  {content["Image-Text-Link-Content-5"]["link-text"]}
                </a>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <img
              src={content["Image-Text-Link-Content-5"]["image-content"]}
              className="border-4 rounded-lg border-white object-cover shadow-md my-0"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
