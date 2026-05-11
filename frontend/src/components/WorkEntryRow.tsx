import {
  FiUpload,
} from "react-icons/fi";

import PhotoCard from "./PhotoCard";

export default function WorkEntryRow({
  row,
  index,
  workTypes,
  uploadingRow,
  selectedFiles,
  updateRow,
  handleDeleteRow,
  handlePhotoUpload,
  handleDeletePhoto,
  setSelectedFiles,
}: any) {

  return (

    <div
      className="
        rounded-3xl
        border
        border-[#E8E5DF]
        bg-white
        p-6
        shadow-sm
      "
    >

      {/* Top */}
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-xl
            font-semibold
            text-[#1E1E1E]
          "
        >
          Work Item
        </h3>

        {row.id && (

          <button
            onClick={() =>
              handleDeleteRow(
                row.id
              )
            }
            className="
              rounded-2xl
              bg-red-50
              px-4
              py-2
              text-sm
              text-red-500
            "
          >
            Delete
          </button>

        )}

      </div>

      {/* Inputs */}
      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >

        {/* Work Type */}
        <select
          value={
            row.work_type_id ||
            ""
          }
          onChange={(e) =>
            updateRow(
              index,
              "work_type_id",
              Number(
                e.target.value
              )
            )
          }
          className="
            rounded-2xl
            border
            border-[#E8E5DF]
            bg-white
            px-5
            py-4
            outline-none
          "
        >

          <option value="">
            Select Work Type
          </option>

          {workTypes.map(
            (wt: any) => (

              <option
                key={wt.id}
                value={wt.id}
              >
                {wt.name}
              </option>

            )
          )}

        </select>

        {/* Workers */}
        <input
          type="number"
          value={
            row.workers_count
          }
          onChange={(e) =>
            updateRow(
              index,
              "workers_count",
              Number(
                e.target.value
              )
            )
          }
          className="
            rounded-2xl
            border
            border-[#E8E5DF]
            bg-white
            px-5
            py-4
            outline-none
          "
        />

        {/* Remarks */}
        <input
          placeholder="Remarks"
          value={
            row.remarks || ""
          }
          onChange={(e) =>
            updateRow(
              index,
              "remarks",
              e.target.value
            )
          }
          className="
            rounded-2xl
            border
            border-[#E8E5DF]
            bg-white
            px-5
            py-4
            outline-none
          "
        />

      </div>

      {/* Upload */}
      <div className="mt-5">

        {row.id ? (
          <>

            <label
              className="
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-2xl
                bg-[#F5F1EA]
                px-5
                py-3
                text-sm
                text-[#1E1E1E]
                hover:bg-[#EFE7D7]
              "
            >

              <FiUpload />

              Upload / Take Photo

              <input
                type="file"
                hidden
                accept="image/*"
                capture="environment"
                onChange={async (
                  e
                ) => {

                  if (
                    e.target.files?.[0]
                  ) {

                    const file =
                      e.target
                        .files[0];

                    setSelectedFiles(
                      (
                        prev: any
                      ) => ({
                        ...prev,
                        [index]:
                          file.name,
                      })
                    );

                    await handlePhotoUpload(
                      index,
                      row.id,
                      file
                    );

                    e.target.value =
                      "";
                  }
                }}
              />

            </label>

            {/* Selected File */}
            {selectedFiles[
              index
            ] && (

              <p
                className="
                  mt-3
                  text-sm
                  text-[#D9C7A6]
                "
              >
                Uploading:{" "}
                {
                  selectedFiles[
                    index
                  ]
                }
              </p>

            )}

            {/* Uploading */}
            {uploadingRow ===
              index && (

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-400
                "
              >
                Uploading photo...
              </p>

            )}

          </>
        ) : (

          <p
            className="
              text-sm
              text-gray-400
            "
          >
            Save entry before
            uploading photos
          </p>

        )}

      </div>

      {/* Photos */}
      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-4
        "
      >

        {(row.photos || []).map(
          (
            photo: any,
            photoIndex: number
          ) => (

            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() =>
                handleDeletePhoto(
                  index,
                  photoIndex
                )
              }
            />

          )
        )}

      </div>

    </div>
  );
}