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

export interface OrderExecutorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "executeDecreaseOrder"
      | "executeIncreaseOrder"
      | "executeSwapOrder"
      | "orderBook"
      | "vault"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeDecreaseOrder",
    values: [AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeIncreaseOrder",
    values: [AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeSwapOrder",
    values: [AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "orderBook", values?: undefined): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "executeDecreaseOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeIncreaseOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeSwapOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "orderBook", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
}

export interface OrderExecutor extends BaseContract {
  connect(runner?: ContractRunner | null): OrderExecutor;
  waitForDeployment(): Promise<this>;

  interface: OrderExecutorInterface;

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

  executeDecreaseOrder: TypedContractMethod<
    [
      _address: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  executeIncreaseOrder: TypedContractMethod<
    [
      _address: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  executeSwapOrder: TypedContractMethod<
    [
      _account: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  orderBook: TypedContractMethod<[], [string], "view">;

  vault: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "executeDecreaseOrder"
  ): TypedContractMethod<
    [
      _address: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "executeIncreaseOrder"
  ): TypedContractMethod<
    [
      _address: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "executeSwapOrder"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _orderIndex: BigNumberish,
      _feeReceiver: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "orderBook"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "vault"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}