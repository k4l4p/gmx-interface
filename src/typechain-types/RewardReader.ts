/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface RewardReaderInterface extends Interface {
  getFunction(nameOrSignature: "getDepositBalances" | "getStakingInfo" | "getVestingInfoV2"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDepositBalances",
    values: [AddressLike, AddressLike[], AddressLike[]]
  ): string;
  encodeFunctionData(functionFragment: "getStakingInfo", values: [AddressLike, AddressLike[]]): string;
  encodeFunctionData(functionFragment: "getVestingInfoV2", values: [AddressLike, AddressLike[]]): string;

  decodeFunctionResult(functionFragment: "getDepositBalances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getStakingInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getVestingInfoV2", data: BytesLike): Result;
}

export interface RewardReader extends BaseContract {
  connect(runner?: ContractRunner | null): RewardReader;
  waitForDeployment(): Promise<this>;

  interface: RewardReaderInterface;

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

  on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;

  getDepositBalances: TypedContractMethod<
    [_account: AddressLike, _depositTokens: AddressLike[], _rewardTrackers: AddressLike[]],
    [bigint[]],
    "view"
  >;

  getStakingInfo: TypedContractMethod<[_account: AddressLike, _rewardTrackers: AddressLike[]], [bigint[]], "view">;

  getVestingInfoV2: TypedContractMethod<[_account: AddressLike, _vesters: AddressLike[]], [bigint[]], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(
    nameOrSignature: "getDepositBalances"
  ): TypedContractMethod<
    [_account: AddressLike, _depositTokens: AddressLike[], _rewardTrackers: AddressLike[]],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getStakingInfo"
  ): TypedContractMethod<[_account: AddressLike, _rewardTrackers: AddressLike[]], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getVestingInfoV2"
  ): TypedContractMethod<[_account: AddressLike, _vesters: AddressLike[]], [bigint[]], "view">;

  filters: {};
}
