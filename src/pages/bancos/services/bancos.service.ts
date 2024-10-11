import axios from "axios";
import {
  iParamToInsert,
  iParamGetBanco,
  iBancoResponse,
  iParamToUpdate,
  iFieldDuplicity,
  iGetDuplicityResponse,
  iToDeleteResponse,
  iInsertResponse,
} from '../interfaces';

const caminho = "siap/bancos";


const getBancos = async ({ param, offset }: iParamGetBanco): Promise<iBancoResponse> => {
  const { data } = await axios.post(caminho, {
    call: "getBancos",
    offset,
    param,
  });
  return data;
};

const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponse> => {
  const { data } = await axios.post(caminho, {
    call: "getDuplicidade",
    value,
    field,
  });
  return data;
};

const toInsert = async (newFields: iParamToInsert): Promise<iInsertResponse> => {
  const { data } = await axios.post(caminho, {
    call: "insert",
    param: newFields,
  });
  return data;
};

const toUpdate = async (param: iParamToUpdate) => {
  let { data } = await axios.post(caminho, {
    call: "update",
    param,
  });
  return data;
};

const toDelete = async (cd_banco: string): Promise<iToDeleteResponse> => {
  let { data } = await axios.post(caminho, {
    call: "delete",
    cd_banco
  });
  return data
};

export default {
  getBancos,
  getDuplicidade,
  toInsert,
  toUpdate,
  toDelete,
};
