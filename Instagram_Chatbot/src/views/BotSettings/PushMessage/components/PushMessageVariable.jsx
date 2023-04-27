import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../../../api/api-management";
import { tokenExpired } from "api/tokenExpired";

const PushMessageVariable = ({ item, i, register, handleRemoveDiv }) => {
  const [listVar, setListVar] = useState([]);

  const getListVar = async () => {
    try {
      const bot_id = Cookies.get("bot_id");
      const res = await api.get(
        `/api/v1/managements/chatbots/${bot_id}/variables?page=all`
      );
      setListVar(res.data.data);
    } catch (err) {
      if (err.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  useEffect(() => {
    getListVar();
  }, []);

  return (
    <>
      <select
        name={`newAnd${i}`}
        id={`newAnd${i}`}
        defaultValue={`and`}
        style={{ width: "15%", margin: "1% 1%" }}
      >
        <option value="and">AND</option>
      </select>
      <select
        id={`var${i}`}
        name={`var${i}`}
        defaultValue={"variable"}
        style={{ width: "15%", margin: "1% 1%" }}
      >
        <option value="variable">変数</option>
      </select>
      <select
        name={`variable_id${i}`}
        id={`variable_id${i}`}
        style={{ width: "30%", margin: "1% 1%" }}
        defaultValue={item.id && listVar.find((x) => x.id === item.variable_id)}
        {...register(`variable_id___${i}`)}
      >
        {listVar &&
          listVar.map((e, index) => (
            <option
              selected={item && item.variable_id === e.id}
              value={`${e.id}`}
              key={index}
            >
              {e.variable_name}
            </option>
          ))}
      </select>
      <select
        name={`operator${i}`}
        id={`operator${i}`}
        style={{ width: "13%", margin: "1% 1%" }}
        {...register(`operator___${i}`)}
      >
        <option value="is">Is</option>
        <option value="is_not">Is not</option>
        <option value="contains">Contains</option>
      </select>
      <input
        name={`value${i}`}
        id={`value${i}`}
        style={{ width: "13%", margin: "1% 1%" }}
        defaultValue={item && item.value}
        {...register(`value___${i}`)}
      />

      <div
        style={{
          width: "15%",
          margin: "1% 0% 1% 2%",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#ff3333",
          color: "white",
          cursor: "pointer",
        }}
        className="text-center"
        onClick={(e) => handleRemoveDiv(i)}
      >
        削除
      </div>
    </>
  );
};

export default PushMessageVariable;
