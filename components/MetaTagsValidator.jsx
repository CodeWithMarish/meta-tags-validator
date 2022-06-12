import React from "react";

const Data = ({ label, check }) => {
  let classNames = `w-7 flex-shrink-0 h-7 ${
    check ? "text-green-500" : "text-red-500"
  } rounded-full flex items-end justify-center bg-slate-100`;
  return (
    <div className="flex space-x-3">
      {check ? (
        <div className={classNames}>&#10004;</div>
      ) : (
        <div className={classNames}>&#10060;</div>
      )}
      <p>{label}</p>
    </div>
  );
};

const MetaTagsValidator = ({ metaTagsList, metaTags }) => {
  let tagsList = {
    "Basic Meta Tags": ["title", "description"],
    "Open Graph Tags": [
      "og:title",
      "og:description",
      "og:image",
      "og:site_name",
      "og:url",
    ],
    "Twitter Tags": [
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:url",
      "twitter:card",
    ],
  };

  return (
    <div className="flex flex-col space-y-4">
      <Data
        label={`Total ${metaTagsList.length} Meta Tags found.`}
        check={metaTagsList.length > 0}
      />
      {Object.keys(tagsList).map((tag) => {
        return (
          <div key={tag} className="flex flex-col space-y-4">
            <Data
              label={tag}
              check={tagsList[tag].every((v) => (metaTags[v] ? true : false))}
            />
            <div className="flex flex-col space-y-3 ml-10 mt-4">
              {tagsList[tag].map((t) => {
                let c = metaTags[t] ? true : false;
                return (
                  <Data
                    key={`meta-${t}`}
                    check={c}
                    label={`meta ${t} ${c ? "found" : "not found"}`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetaTagsValidator;
