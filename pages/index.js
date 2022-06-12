import axios from "axios";
import { useState, useEffect } from "react";
import MetaTagsValidator from "../components/MetaTagsValidator";
export default function Home() {
  const [metaTags, setMetaTags] = useState();
  const [metaTagsList, setMetagsList] = useState([]);
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [url, setURL] = useState("https://codewithmarish.com");

  const fetchData = async (url) => {
    const {
      data: { response, err },
    } = await axios.post("/api/metacardvalidator", {
      url: url,
    });

    setResponse(response);
    setError(err);
  };

  const getData = (data) => {
    const regexp = new RegExp("<meta.*?(|</meta)>", "g");
    let metaTagsContent = {};
    let metaTagsList = [];
    if (data) {
      metaTagsList = data.match(regexp);
      metaTagsList.map((tag) => {
        let nameRegexp = new RegExp(
          '((?<=name=")|(?<=property=")).*?(?=")',
          "g"
        );
        let contentRegexp = new RegExp('(?<=content=").*?(?=")', "g");
        let contentRegexp1 = new RegExp("<meta*?>(.*?)</meta>", "g");
        let name = tag.match(nameRegexp);
        let content = tag.match(contentRegexp);
        content = content || tag.match(contentRegexp1);
        if (name && content) {
          metaTagsContent = {
            ...metaTagsContent,
            [`${name[0]}`]: `${content[0]}`,
          };
        }
      });
    }
    return { metaTagsList, metaTagsContent };
  };
  useEffect(() => {
    fetchData(url);
  }, [url]);

  useEffect(() => {
    const { metaTagsList, metaTagsContent } = getData(response);
    setMetaTags(metaTagsContent);
    setMetagsList(metaTagsList);
  }, [response]);
  return (
    <div className="container max-w-2xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl mb-6 font-medium">
        Meta Tags Validator
      </h1>
      <p className="text-red-400 font-bold">
        Challenge for you: Url Input form should be there here to be dynamic
      </p>
      {error ? (
        <p className="text-red-300">Please enter a valid url or try again</p>
      ) : response && metaTags && metaTagsList ? (
        <div className="flex flex-col space-y-6">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="border flex flex-col-reverse sm:flex-row justify-between"
          >
            <div className="flex flex-col p-4 text-center sm:text-left">
              <p className="text-lg font-bold">
                {metaTags["title"] || metaTags["og:title"]}
              </p>
              <p className="mt-2 max-w-[65ch]">
                {metaTags["description"] || metaTags["og:description"]}
              </p>
              <p className="mt-3">{new URL(url).host}</p>
            </div>
            <img
              src={metaTags["og:image"]}
              className="max-h-36 sm:max-h-32 object-contain self-center"
            />
          </a>
          <MetaTagsValidator metaTags={metaTags} metaTagsList={metaTagsList} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
