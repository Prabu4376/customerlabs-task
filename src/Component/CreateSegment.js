import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";


function CreateSegment() {
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const segmentData = {
      segment_name: data.name,
      schema: schemas.map((schema) => {
        const key = Object.keys(schema)[0].toLowerCase().replace(/\s+/g, "_");
        return { [key]: schema[Object.keys(schema)[0]] };
      }),
    };
    console.log(segmentData);
    setIsLoad(true);
    try {
        const headers = {
        'Content-Type': 'application/json'
        };
      const response = await axios.post("https://webhook.site/00000000-0000-0000-0000-000000000000", segmentData, {headers});
      setIsLoad(false);
      setIsUserCreated(true);
      reset();
      setSchemas([]);
      setTimeout(() => {
        setIsUserCreated(false);
      }, 3000);
    } catch (err) {
      setIsLoad(false);
      console.log(err);
    }
  };

  const addSchema = () => {
    const newSchema = {};
    setSchemas([...schemas, newSchema]);
  };

  return (
    <>
      <button
        className="btn btn-primary save-btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        Save segment
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel"><FaAngleLeft /> Saving Segment</h5>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body-cont">
              <div className="mb-3">
                <label className="mb-3">Enter the Name of the Segment</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && errors.name.type === "required" && (
                  <p className="errorMsg">Name is required.</p>
                )}
              </div>
              <div>
                <p>
                  To save your segment, you need to add the schemas to build the
                  query
                </p>
              </div>
              {schemas.map((schema, index) => (
                <div key={index}>
                  <select
                    className="segment-opt"
                    onChange={(e) => {
                      const updatedSchema = {
                        [e.target.value]: e.target.value,
                      };
                      setSchemas([
                        ...schemas.slice(0, index),
                        updatedSchema,
                        ...schemas.slice(index + 1),
                      ]);
                    }}
                  >
                    <option>Add schema to segment</option>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Gender">Gender</option>
                    <option value="Age">Age</option>
                    <option value="Account Name">Account Name</option>
                    <option value="City">City</option>
                    <option value="State">State</option>
                  </select>
                </div>
              ))}
              <button type="button" onClick={addSchema} className="create-schema">
                + Add new schema
              </button>
            </div>
            <div class="modal-footer-cont">
              <button type="submit" class="btn btn-primary">
                Save the Segment
                {isLoad && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </button>
              <button
                type="button"
                class="btn btn-secondary close-btn"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
            {isUserCreated && (
              <p className="alert alert-success" role="alert">
                Segment has been created successfully!!!
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSegment;
