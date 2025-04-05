import React from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dxbd6u6pq"
  }
})

export const UploadImage = () => {

  return (
    <div className="container align-items-center">
      <div className="m-auto">
        <AdvancedImage cldImg={cld.image('/cld-sample-5').resize(Resize.scale().width(325).height(250))} />
      </div>
    </div>
  )
}