// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;


import {Test, console} from "forge-std/Test.sol";
import {CashCow} from "../src/CashCow.sol";
import {CowCash} from "../src/CowCash.sol";
import {IERC20} from "../src/interfaces/IERC20.sol";
import {ValueConduct} from "../src/ValueConduct.sol";

import {Script, console} from "forge-std/Script.sol";

contract CounterScript is Script {

address immutable DEGEN_ADDR = 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed;
address immutable V2Factory = 0x71524B4f93c58fcbF659783284E38825f0622859;
address immutable V2Router = 0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891;
address immutable sweepTo = 0xE7b30A037F5598E4e73702ca66A59Af5CC650Dcd;

ValueConduct VCC;
CashCow COW;

uint256 dealID;

    function run() public {

        vm.startBroadcast(vm.envUint("EVMO_1_PVK"));

        COW = new CashCow(DEGEN_ADDR, V2Factory, V2Router, sweepTo);
        VCC = new ValueConduct(0x34F10b00cd1F032106BD7CBdA208934cF70764BC);

        VCC.approve(address(COW), type(uint256).max);

        // dealId = CCOW.createDeal(VC.address, howMuchProjectToken, howMuchDAI, 356, 356, "12345678912345678912345678900012",
        COW.createDeal(address(VCC), 100, 10000, 10, 110, "none...");


        console.log( address(COW) ,  "cow --- vcc    ",  address(VCC) );
    }
}
