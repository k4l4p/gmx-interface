/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace GlvDepositUtils {
  export type CreateGlvDepositParamsStruct = {
    glv: AddressLike;
    market: AddressLike;
    receiver: AddressLike;
    callbackContract: AddressLike;
    uiFeeReceiver: AddressLike;
    initialLongToken: AddressLike;
    initialShortToken: AddressLike;
    longTokenSwapPath: AddressLike[];
    shortTokenSwapPath: AddressLike[];
    minGlvTokens: BigNumberish;
    executionFee: BigNumberish;
    callbackGasLimit: BigNumberish;
    shouldUnwrapNativeToken: boolean;
    isMarketTokenDeposit: boolean;
  };

  export type CreateGlvDepositParamsStructOutput = [
    glv: string,
    market: string,
    receiver: string,
    callbackContract: string,
    uiFeeReceiver: string,
    initialLongToken: string,
    initialShortToken: string,
    longTokenSwapPath: string[],
    shortTokenSwapPath: string[],
    minGlvTokens: bigint,
    executionFee: bigint,
    callbackGasLimit: bigint,
    shouldUnwrapNativeToken: boolean,
    isMarketTokenDeposit: boolean
  ] & {
    glv: string;
    market: string;
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    initialLongToken: string;
    initialShortToken: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
    minGlvTokens: bigint;
    executionFee: bigint;
    callbackGasLimit: bigint;
    shouldUnwrapNativeToken: boolean;
    isMarketTokenDeposit: boolean;
  };
}

export declare namespace GlvWithdrawalUtils {
  export type CreateGlvWithdrawalParamsStruct = {
    receiver: AddressLike;
    callbackContract: AddressLike;
    uiFeeReceiver: AddressLike;
    market: AddressLike;
    glv: AddressLike;
    longTokenSwapPath: AddressLike[];
    shortTokenSwapPath: AddressLike[];
    minLongTokenAmount: BigNumberish;
    minShortTokenAmount: BigNumberish;
    shouldUnwrapNativeToken: boolean;
    executionFee: BigNumberish;
    callbackGasLimit: BigNumberish;
  };

  export type CreateGlvWithdrawalParamsStructOutput = [
    receiver: string,
    callbackContract: string,
    uiFeeReceiver: string,
    market: string,
    glv: string,
    longTokenSwapPath: string[],
    shortTokenSwapPath: string[],
    minLongTokenAmount: bigint,
    minShortTokenAmount: bigint,
    shouldUnwrapNativeToken: boolean,
    executionFee: bigint,
    callbackGasLimit: bigint
  ] & {
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    market: string;
    glv: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
    minLongTokenAmount: bigint;
    minShortTokenAmount: bigint;
    shouldUnwrapNativeToken: boolean;
    executionFee: bigint;
    callbackGasLimit: bigint;
  };
}

export declare namespace Price {
  export type PropsStruct = { min: BigNumberish; max: BigNumberish };

  export type PropsStructOutput = [min: bigint, max: bigint] & {
    min: bigint;
    max: bigint;
  };
}

export declare namespace OracleUtils {
  export type SimulatePricesParamsStruct = {
    primaryTokens: AddressLike[];
    primaryPrices: Price.PropsStruct[];
    minTimestamp: BigNumberish;
    maxTimestamp: BigNumberish;
  };

  export type SimulatePricesParamsStructOutput = [
    primaryTokens: string[],
    primaryPrices: Price.PropsStructOutput[],
    minTimestamp: bigint,
    maxTimestamp: bigint
  ] & {
    primaryTokens: string[];
    primaryPrices: Price.PropsStructOutput[];
    minTimestamp: bigint;
    maxTimestamp: bigint;
  };
}

export interface GlvRouterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "cancelGlvDeposit"
      | "cancelGlvWithdrawal"
      | "createGlvDeposit"
      | "createGlvWithdrawal"
      | "dataStore"
      | "eventEmitter"
      | "externalHandler"
      | "glvHandler"
      | "makeExternalCalls"
      | "multicall"
      | "roleStore"
      | "router"
      | "sendNativeToken"
      | "sendTokens"
      | "sendWnt"
      | "simulateExecuteGlvDeposit"
      | "simulateExecuteGlvWithdrawal"
      | "simulateExecuteLatestGlvDeposit"
      | "simulateExecuteLatestGlvWithdrawal"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "cancelGlvDeposit",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelGlvWithdrawal",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createGlvDeposit",
    values: [GlvDepositUtils.CreateGlvDepositParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "createGlvWithdrawal",
    values: [GlvWithdrawalUtils.CreateGlvWithdrawalParamsStruct]
  ): string;
  encodeFunctionData(functionFragment: "dataStore", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "eventEmitter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "externalHandler",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "glvHandler",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "makeExternalCalls",
    values: [AddressLike[], BytesLike[], AddressLike[], AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "roleStore", values?: undefined): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sendNativeToken",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sendTokens",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sendWnt",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateExecuteGlvDeposit",
    values: [BytesLike, OracleUtils.SimulatePricesParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateExecuteGlvWithdrawal",
    values: [BytesLike, OracleUtils.SimulatePricesParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateExecuteLatestGlvDeposit",
    values: [OracleUtils.SimulatePricesParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateExecuteLatestGlvWithdrawal",
    values: [OracleUtils.SimulatePricesParamsStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelGlvDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelGlvWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createGlvDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createGlvWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dataStore", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "eventEmitter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "externalHandler",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "glvHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "makeExternalCalls",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "roleStore", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sendNativeToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sendWnt", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "simulateExecuteGlvDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulateExecuteGlvWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulateExecuteLatestGlvDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulateExecuteLatestGlvWithdrawal",
    data: BytesLike
  ): Result;
}

export interface GlvRouter extends BaseContract {
  connect(runner?: ContractRunner | null): GlvRouter;
  waitForDeployment(): Promise<this>;

  interface: GlvRouterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  cancelGlvDeposit: TypedContractMethod<[key: BytesLike], [void], "nonpayable">;

  cancelGlvWithdrawal: TypedContractMethod<
    [key: BytesLike],
    [void],
    "nonpayable"
  >;

  createGlvDeposit: TypedContractMethod<
    [params: GlvDepositUtils.CreateGlvDepositParamsStruct],
    [string],
    "payable"
  >;

  createGlvWithdrawal: TypedContractMethod<
    [params: GlvWithdrawalUtils.CreateGlvWithdrawalParamsStruct],
    [string],
    "payable"
  >;

  dataStore: TypedContractMethod<[], [string], "view">;

  eventEmitter: TypedContractMethod<[], [string], "view">;

  externalHandler: TypedContractMethod<[], [string], "view">;

  glvHandler: TypedContractMethod<[], [string], "view">;

  makeExternalCalls: TypedContractMethod<
    [
      externalCallTargets: AddressLike[],
      externalCallDataList: BytesLike[],
      refundTokens: AddressLike[],
      refundReceivers: AddressLike[]
    ],
    [void],
    "nonpayable"
  >;

  multicall: TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;

  roleStore: TypedContractMethod<[], [string], "view">;

  router: TypedContractMethod<[], [string], "view">;

  sendNativeToken: TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  sendTokens: TypedContractMethod<
    [token: AddressLike, receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  sendWnt: TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  simulateExecuteGlvDeposit: TypedContractMethod<
    [
      key: BytesLike,
      simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct
    ],
    [void],
    "payable"
  >;

  simulateExecuteGlvWithdrawal: TypedContractMethod<
    [
      key: BytesLike,
      simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct
    ],
    [void],
    "payable"
  >;

  simulateExecuteLatestGlvDeposit: TypedContractMethod<
    [simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct],
    [void],
    "payable"
  >;

  simulateExecuteLatestGlvWithdrawal: TypedContractMethod<
    [simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct],
    [void],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "cancelGlvDeposit"
  ): TypedContractMethod<[key: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "cancelGlvWithdrawal"
  ): TypedContractMethod<[key: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createGlvDeposit"
  ): TypedContractMethod<
    [params: GlvDepositUtils.CreateGlvDepositParamsStruct],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "createGlvWithdrawal"
  ): TypedContractMethod<
    [params: GlvWithdrawalUtils.CreateGlvWithdrawalParamsStruct],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "dataStore"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "eventEmitter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "externalHandler"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "glvHandler"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "makeExternalCalls"
  ): TypedContractMethod<
    [
      externalCallTargets: AddressLike[],
      externalCallDataList: BytesLike[],
      refundTokens: AddressLike[],
      refundReceivers: AddressLike[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "multicall"
  ): TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;
  getFunction(
    nameOrSignature: "roleStore"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "router"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "sendNativeToken"
  ): TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "sendTokens"
  ): TypedContractMethod<
    [token: AddressLike, receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "sendWnt"
  ): TypedContractMethod<
    [receiver: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "simulateExecuteGlvDeposit"
  ): TypedContractMethod<
    [
      key: BytesLike,
      simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "simulateExecuteGlvWithdrawal"
  ): TypedContractMethod<
    [
      key: BytesLike,
      simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "simulateExecuteLatestGlvDeposit"
  ): TypedContractMethod<
    [simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "simulateExecuteLatestGlvWithdrawal"
  ): TypedContractMethod<
    [simulatedOracleParams: OracleUtils.SimulatePricesParamsStruct],
    [void],
    "payable"
  >;

  filters: {};
}