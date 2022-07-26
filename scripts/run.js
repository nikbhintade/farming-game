const hre = require("hardhat");
const ethers = require('ethers');
const HoundLaamaABI = require('../artifacts/contracts/HoundLaama.sol/HoundLaama.json');

const randomAirdropAddressList = [
  { "user": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", "check": true, "userType": false },
  { "user": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "check": true, "userType": false },
  { "user": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "check": true, "userType": false },
  { "user": "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "check": true, "userType": false },
  { "user": "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "check": true, "userType": false },
  { "user": "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "check": true, "userType": false },
  { "user": "0x976ea74026e726554db657fa54763abd0c3a0aa9", "check": true, "userType": false },
  { "user": "0x14dc79964da2c08b23698b3d3cc7ca32193d9955", "check": true, "userType": false },
  { "user": "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f", "check": true, "userType": false },
  { "user": "0xa0ee7a142d267c1f36714e4a8f75612f20a79720", "check": true, "userType": false },
  { "user": "0xbcd4042de499d14e55001ccbb24a551f3b954096", "check": true, "userType": false },
  { "user": "0x71be63f3384f5fb98995898a86b02fb2426c5788", "check": true, "userType": false },
  { "user": "0xfabb0ac9d68b0b445fb7357272ff202c5651694a", "check": true, "userType": false },
  { "user": "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec", "check": true, "userType": false },
  { "user": "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097", "check": true, "userType": false },
  { "user": "0xcd3b766ccdd6ae721141f452c550ca635964ce71", "check": true, "userType": false },
  { "user": "0x2546bcd3c84621e976d8185a91a922ae77ecec30", "check": true, "userType": false },
  { "user": "0xbda5747bfd65f08deb54cb465eb87d40e51b197e", "check": true, "userType": false },
  { "user": "0xdd2fd4581271e230360230f9337d5c0430bf44c0", "check": true, "userType": false },
  { "user": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", "check": true, "userType": false },
  { "user": "0x09db0a93b389bef724429898f539aeb7ac2dd55f", "check": true, "userType": false },
  { "user": "0x02484cb50aac86eae85610d6f4bf026f30f6627d", "check": true, "userType": false },
  { "user": "0x08135da0a343e492fa2d4282f2ae34c6c5cc1bbe", "check": true, "userType": false },
  { "user": "0x5e661b79fe2d3f6ce70f5aac07d8cd9abb2743f1", "check": true, "userType": false },
  { "user": "0x61097ba76cd906d2ba4fd106e757f7eb455fc295", "check": true, "userType": false },
  { "user": "0xdf37f81daad2b0327a0a50003740e1c935c70913", "check": true, "userType": false },
  { "user": "0x553bc17a05702530097c3677091c5bb47a3a7931", "check": true, "userType": false },
  { "user": "0x87bdce72c06c21cd96219bd8521bdf1f42c78b5e", "check": true, "userType": false },
  { "user": "0x40fc963a729c542424cd800349a7e4ecc4896624", "check": true, "userType": false },
  { "user": "0x9dcce783b6464611f38631e6c851bf441907c710", "check": true, "userType": false },
  { "user": "0x1bcb8e569eedab4668e55145cfeaf190902d3cf2", "check": true, "userType": false },
  { "user": "0x8263fce86b1b78f95ab4dae11907d8af88f841e7", "check": true, "userType": false },
  { "user": "0xcf2d5b3cbb4d7bf04e3f7bfa8e27081b52191f91", "check": true, "userType": false },
  { "user": "0x86c53eb85d0b7548fea5c4b4f82b4205c8f6ac18", "check": true, "userType": false },
  { "user": "0x1aac82773cb722166d7da0d5b0fa35b0307dd99d", "check": true, "userType": false },
  { "user": "0x2f4f06d218e426344cfe1a83d53dad806994d325", "check": true, "userType": false },
  { "user": "0x1003ff39d25f2ab16dbcc18ece05a9b6154f65f4", "check": true, "userType": false },
  { "user": "0x9eaf5590f2c84912a08de97fa28d0529361deb9e", "check": true, "userType": false },
  { "user": "0x11e8f3ea3c6fcf12ecff2722d75cefc539c51a1c", "check": true, "userType": false },
  { "user": "0x7d86687f980a56b832e9378952b738b614a99dc6", "check": true, "userType": false },
  { "user": "0x9ef6c02fb2ecc446146e05f1ff687a788a8bf76d", "check": true, "userType": false },
  { "user": "0x08a2de6f3528319123b25935c92888b16db8913e", "check": true, "userType": false },
  { "user": "0xe141c82d99d85098e03e1a1cc1cde676556fdde0", "check": true, "userType": false },
  { "user": "0x4b23d303d9e3719d6cdf8d172ea030f80509ea15", "check": true, "userType": false },
  { "user": "0xc004e69c5c04a223463ff32042dd36dabf63a25a", "check": true, "userType": false },
  { "user": "0x5eb15c0992734b5e77c888d713b4fc67b3d679a2", "check": true, "userType": false },
  { "user": "0x7ebb637fd68c523613be51aad27c35c4db199b9c", "check": true, "userType": false },
  { "user": "0x3c3e2e178c69d4bad964568415a0f0c84fd6320a", "check": true, "userType": false },
  { "user": "0x35304262b9e87c00c430149f28dd154995d01207", "check": true, "userType": false },
  { "user": "0xd4a1e660c916855229e1712090ccfd8a424a2e33", "check": true, "userType": false },
  { "user": "0xee7f6a930b29d7350498af97f0f9672eaecbeeff", "check": true, "userType": false },
  { "user": "0x145e2dc5c8238d1be628f87076a37d4a26a78544", "check": true, "userType": false },
  { "user": "0xd6a098ebcc5f8bd4e174d915c54486b077a34a51", "check": true, "userType": false },
  { "user": "0x042a63149117602129b6922ecfe3111168c2c323", "check": true, "userType": false },
  { "user": "0xa0ec9ee47802ceb56eb58ce80f3e41630b771b04", "check": true, "userType": false },
  { "user": "0xe8b1ff302a740fd2c6e76b620d45508daec2ddff", "check": true, "userType": false },
  { "user": "0xab707cb80e7de7c75d815b1a653433f3eec44c74", "check": true, "userType": false },
  { "user": "0x0d803cdeee5990f22c2a8df10a695d2312da26cc", "check": true, "userType": false },
  { "user": "0x1c87bb9234aec6adc580eae6c8b59558a4502220", "check": true, "userType": false },
  { "user": "0x4779d18931b35540f84b0cd0e9633855b84df7b8", "check": true, "userType": false },
  { "user": "0xc0543b0b980d8c834cbdf023b2d2a75b5f9d1909", "check": true, "userType": false },
  { "user": "0x73b3074ac649a8dc31c2c90a124469456301a30f", "check": true, "userType": false },
  { "user": "0x265188114eb5d5536bc8654d8e9710fe72c28c4d", "check": true, "userType": false },
  { "user": "0x924ba5ce9f91dded37b4ebf8c0dc82a40202fc0a", "check": true, "userType": false },
  { "user": "0x64492e25c30031edad55e57cea599cdb1f06dad1", "check": true, "userType": false },
  { "user": "0x262595fa2a3a86adacde208589614d483e3ef1c0", "check": true, "userType": false },
  { "user": "0xdfd99099fa13541a64aee9aad61c0dbf3d32d492", "check": true, "userType": false },
  { "user": "0x63c3686ef31c03a641e2ea8993a91ea351e5891a", "check": true, "userType": false },
  { "user": "0x9394cb5f737bd3acea7dce90ca48dbd42801ee5d", "check": true, "userType": false },
  { "user": "0x344dca30f5c5f74f2f13dc1d48ad3a9069d13ad9", "check": true, "userType": false },
  { "user": "0xf23e054d8b4d0becfa22deef5632f27f781f8bf5", "check": true, "userType": false },
  { "user": "0x6d69f301d1da5c7818b5e61eecc745b30179c68b", "check": true, "userType": false },
  { "user": "0xf0ce7bab13c99ba0565f426508a7cd8f4c247e5a", "check": true, "userType": false },
  { "user": "0x011bd5423c5f77b5a0789e27f922535fd76b688f", "check": true, "userType": false },
  { "user": "0xd9065f27e9b706e5f7628e067cc00b288dddbf19", "check": true, "userType": false },
  { "user": "0x54ccceb38251c29b628ef8b00b3cab97e7cac7d5", "check": true, "userType": false },
  { "user": "0xa1196426b41627ae75ea7f7409e074be97367da2", "check": true, "userType": false },
  { "user": "0xe74cef90b6cf1a77fefad731713e6f53e575c183", "check": true, "userType": false },
  { "user": "0x7df8efa6d6f1cb5c4f36315e0acb82b02ae8ba40", "check": true, "userType": false },
  { "user": "0x9e126c57330fa71556628e0aabd6b6b6783d99fa", "check": true, "userType": false },
  { "user": "0x586ba39027a74e8d40e6626f89ae97ba7f616644", "check": true, "userType": false },
  { "user": "0x9a50ed082cf2fc003152580dcdb320b834fa379e", "check": true, "userType": false },
  { "user": "0xbc8183bac3e969042736f7af07f76223d11d2148", "check": true, "userType": false },
  { "user": "0x586af62eae7f447d14d25f53918814e04d3a5ba4", "check": true, "userType": false },
  { "user": "0xccdd262f272ee6c226266eea13ee48d4d932ce66", "check": true, "userType": false },
  { "user": "0xf0eeddc5e015d4c459590e01dcc2f2fd1d2baac7", "check": true, "userType": false },
  { "user": "0x4edfedff17ab9642f8464d6143900903dd21421a", "check": true, "userType": false },
  { "user": "0x492c973c16e8aec46f4d71716e91b05b245377c9", "check": true, "userType": false },
  { "user": "0xe5d3ab6883b7e8c35c04675f28bb992ca1129ee4", "check": true, "userType": false },
  { "user": "0x71f280dea6fc5a03790941ad72956f545feb7a52", "check": true, "userType": false },
  { "user": "0xe77478d9e136d3643cfc6fef578abf63f9ab91b1", "check": true, "userType": false },
  { "user": "0x6c8ea11559dfe79ae3dbdd6a67b47f61b929398f", "check": true, "userType": false },
  { "user": "0x48fa7b63049a6f4e7316eb2d9c5bdda8933bca2f", "check": true, "userType": false },
  { "user": "0x16adfbefdefd488c992086d472a4ca577a0e5e54", "check": true, "userType": false },
  { "user": "0x225356ff5d64889d7364be2c990f93a66298ee8d", "check": true, "userType": false },
  { "user": "0xcbdc0f9a4c38f1e010bd3b6e43598a55d1868c23", "check": true, "userType": false },
  { "user": "0xbc5bdcee96b1bc47822c74e6f64186fba7d686be", "check": true, "userType": false },
  { "user": "0x0536896a5e38bbd59f3f369ff3682677965abd19", "check": true, "userType": false },
  { "user": "0xfe0f143fcad5b561b1ed2ac960278a2f23559ef9", "check": true, "userType": false },
  { "user": "0x98d08079928fccb30598c6c6382abfd7dbfaa1cd", "check": true, "userType": false },
  { "user": "0x8c3229ec621644789d7f61faa82c6d0e5f97d43d", "check": true, "userType": false },
  { "user": "0x9586a4833970847aef259ad5bfb7aa8901ddf746", "check": true, "userType": false },
  { "user": "0x0e9971c0005d91336c1441b8f03c1c4fe5fb4584", "check": true, "userType": false },
  { "user": "0xc4c81d5c1851702d27d602aa8ff830a7689f17cc", "check": true, "userType": false },
  { "user": "0x9c79357189d6af261691ecf48de9a6bbf30438fc", "check": true, "userType": false },
  { "user": "0xd96eb0f2e106ea7c0a939e9c460a17ace65fecff", "check": true, "userType": false },
  { "user": "0x4548774216f19914493d051481feb56246bc13f0", "check": true, "userType": false },
  { "user": "0xfdaa62ea18331afa45cc78b44dba58d809eab80e", "check": true, "userType": false },
  { "user": "0x7d19cea5598accbbf0005a8eb8ed6a02c6f8ab84", "check": true, "userType": false },
  { "user": "0xeabd5094570298ffd24e93e7af378162884611cb", "check": true, "userType": false },
  { "user": "0x51953940f874efa94f92eb2d6aed023617a07222", "check": true, "userType": false },
  { "user": "0x6813ae1fc15e995230c05d4480d50219bb635f15", "check": true, "userType": false },
  { "user": "0x11c9cfec77102a7c903a2d2319c79e7b0bbc9235", "check": true, "userType": false },
  { "user": "0xbe9086f1a38740f297f6347b531732541289b220", "check": true, "userType": false },
  { "user": "0xd4db664b707353422b1ffc94038cdd0a7d074d51", "check": true, "userType": false },
  { "user": "0x11ba29fe987addfa480ffecf3d98b26630917a78", "check": true, "userType": false },
  { "user": "0xffd57510605b4f47a58576ccc059ab8882c7ea00", "check": true, "userType": false },
  { "user": "0x83781cf2371117aac856621805fb83c9ca439bad", "check": true, "userType": false },
  { "user": "0x2bac2e5a4f39c32ed16205591ba26e307414ca9e", "check": true, "userType": false },
  { "user": "0x8d86ef40df93b1b3822bf996b972ba53e79c07c9", "check": true, "userType": false },
  { "user": "0xc9db8bec097c2cbdce109e03a36f98a87e04ffef", "check": true, "userType": false },
  { "user": "0x925eb78beb9a84cf88dc92df5f2fe7bf33b40104", "check": true, "userType": false },
  { "user": "0x5061a633977476e18b99423ac51c6df50621a597", "check": true, "userType": false },
  { "user": "0x46655f18cc741152515f0d843ad4355b4ad23377", "check": true, "userType": false },
  { "user": "0x012af9b68f94fe212705b708cb69b53508d522a2", "check": true, "userType": false },
  { "user": "0x87194239f32f33d74c99b2545032623b32e3f795", "check": true, "userType": false },
  { "user": "0x0149af4613aa457765d23a38d62685a9623aef35", "check": true, "userType": false },
  { "user": "0xbcca9ecb933db2481111102e73c61c7c7c4e2366", "check": true, "userType": false },
  { "user": "0x20a6250c2cb9b6828ce0b16e09b950e7d0d0556d", "check": true, "userType": false },
  { "user": "0x99f25bc68a4a0d6c9fcaa795d6f8ca738468f679", "check": true, "userType": false },
  { "user": "0x2c7d914a1801242017bd00abc5a02452e1305c63", "check": true, "userType": false },
  { "user": "0x5a3a245e0523b2728ec8d914358e33671e27872d", "check": true, "userType": false },
  { "user": "0x3e13f655ce1cbc382e3e09b17266f5ca1326f567", "check": true, "userType": false },
  { "user": "0x148b4d43a550d74b82ea435da0007a7b1048d714", "check": true, "userType": false },
  { "user": "0xc8014c948758904edbead506b08941919261561b", "check": true, "userType": false },
  { "user": "0x09be20d14fc2bab7ba84984c5aebd43b6a37d36e", "check": true, "userType": false },
  { "user": "0x527601c75277b9823fe4eb7d95bf34da6c0c602b", "check": true, "userType": false },
  { "user": "0xf88c5937f7ece778c39ce149e9a863043ec8cb9c", "check": true, "userType": false },
  { "user": "0xb938cfbdb5f0b5efea6e4e18e39390bfeeb47722", "check": true, "userType": false },
  { "user": "0x902d6954691bc8f78202b84bcec7fc0cee8fc83e", "check": true, "userType": false },
  { "user": "0xb24e6c5d01d14be3918ed712ace1b2f7f2bef53a", "check": true, "userType": false },
  { "user": "0xfaf513321611b74ca918df250d6ac38d43ab57f8", "check": true, "userType": false },
  { "user": "0xa576e67c260b90f667e136af1beb9513859c6dc2", "check": true, "userType": false },
  { "user": "0x110958850e5bfe54ceba0a87b1cf7671c501da95", "check": true, "userType": false },
  { "user": "0x0d56282a479497840f27ce4e248616bbdbaff881", "check": true, "userType": false },
  { "user": "0x7f70da265d37edcd337b0df314c3e2208371dda9", "check": true, "userType": false },
  { "user": "0x09c1e3f7d9b6070eeb26ac74df33cce0c5d858f5", "check": true, "userType": false },
  { "user": "0x00297d0b6404d57c0fa9a3d3a6998ef28623444b", "check": true, "userType": false },
  { "user": "0x50a7e8cbecaa992ff5b77289ae3227c9f2cabd9c", "check": true, "userType": false },
  { "user": "0x838d1153557025efb2867d12b2adfe151ac41693", "check": true, "userType": false },
  { "user": "0x280b23f871e8679970cec204bc67d19840cefed0", "check": true, "userType": false },
  { "user": "0x5f5622babb2c7cd60867ca41ac86122abb561449", "check": true, "userType": false },
  { "user": "0xd597a7e5d9eee71843b25347f9091e42db30c2d2", "check": true, "userType": false },
  { "user": "0x100dd58b96152c9d99232920c97a7de1238d3043", "check": true, "userType": false },
  { "user": "0xe8dfc1532693ff0aefe7bee264289806deab3fe3", "check": true, "userType": false },
  { "user": "0x865cf0101f6e34d47a9a4eeb0d39a5dc8faed566", "check": true, "userType": false },
  { "user": "0xfae5d89c5b24b1fb8b86ed9656558cd980d01c43", "check": true, "userType": false },
  { "user": "0x50fc8e8d9b5e9d3df14919c1df634b0f2311538a", "check": true, "userType": false },
  { "user": "0x1848543e04a38df7deef7dfd346effb4f059a849", "check": true, "userType": false },
  { "user": "0x80b8494d411e67c830c34c72b2aadf4d405abdf0", "check": true, "userType": false },
  { "user": "0x3961e9553d9e7aae3b6b497f92966a46d467c823", "check": true, "userType": false },
  { "user": "0xd62dc0f62c5c3b98c75ce130e78a5bdc0021dad8", "check": true, "userType": false },
  { "user": "0xba2ef8c82fdf88ac9ca4163b7cab1a0628d6b936", "check": true, "userType": false },
  { "user": "0xe15b6c968d11723e5454894946dcf78e9ef18d42", "check": true, "userType": false },
  { "user": "0xb65ad69852c853f323e5eef1bf8a1fb4c77e4765", "check": true, "userType": false },
  { "user": "0x1ac9a50e9aabadbede678a65d32f7cf58f2c1d85", "check": true, "userType": false },
  { "user": "0x7233f2a928ed28afb4a323becce6f59712233a77", "check": true, "userType": false },
  { "user": "0x88709c5a505d024368144d0aa5e142ce238962cf", "check": true, "userType": false },
  { "user": "0x0d3c1e9bb0dfdf2ebe674f3ee0c00e944c53fdab", "check": true, "userType": false },
  { "user": "0x62953a71c4d29c602f88c456e91a5f7eecf7fcde", "check": true, "userType": false },
  { "user": "0x4d24dbc55231ceaf86b87f6ca71167bd94577936", "check": true, "userType": false },
  { "user": "0x90c416e481f9944dd7afe0aa0e78e16780580bac", "check": true, "userType": false },
  { "user": "0x4f822bb4fac4b2b6630bdf412e8158c15bd65aae", "check": true, "userType": false },
  { "user": "0xb4076fec6a847622581cdfe9a8381e6e6168f597", "check": true, "userType": false },
  { "user": "0x9c6550109d19a9a9b4568fd63b633f162588a53f", "check": true, "userType": false },
  { "user": "0x450c8c20e62e0d6d91456a79367cc9dbebb03272", "check": true, "userType": false },
  { "user": "0xd85b3541370346b99f5c43b1848eb82bbb2ec3b7", "check": true, "userType": false },
  { "user": "0x82e6e9473928d3108cc891d27b533914e014a8bd", "check": true, "userType": false },
  { "user": "0x21b3de814b091aaaa340550d24440709e32e0c06", "check": true, "userType": false },
  { "user": "0xa521bac16af43f2e9a82cd9bb4f5e328863ec6ac", "check": true, "userType": false },
  { "user": "0xb669e9ecc9132c03b0708e9da76a4f00a30a935b", "check": true, "userType": false },
  { "user": "0x33b1ce5357959ec0043e0d77556a5093ab347862", "check": true, "userType": false },
  { "user": "0x9818dbc159bcc58c7fea87e82e738bdb0fcf03f8", "check": true, "userType": false },
  { "user": "0x38421c898cfc5883ddcec1247ea3f7ff087dd6ca", "check": true, "userType": false },
  { "user": "0xe27ff38c1edeb794ac38867d15620f63f12159e3", "check": true, "userType": false },
  { "user": "0x5ea56c35eb281ce7810fabfa793dd57482d4c913", "check": true, "userType": false },
  { "user": "0xd9594d67fe240c37508be5038443d8d4596efce0", "check": true, "userType": false },
  { "user": "0x6e26847b83ddac8a8aa689a441c5bf168ee5342c", "check": true, "userType": false },
  { "user": "0x0695fddf2154cc8f097db36c4bbde79265d0ad71", "check": true, "userType": false },
  { "user": "0xed77fbd612b5e88a0de4bbb369f90278b87e887a", "check": true, "userType": false },
  { "user": "0xc642a4b180ccbd0beac32d221c6faa1b7890b905", "check": true, "userType": false },
  { "user": "0xcd2afccd6ea22a59235fd99260754a5df136a22b", "check": true, "userType": false },
  { "user": "0x4daf3470dba87da934d22048ef416d6428effd1a", "check": true, "userType": false },
  { "user": "0xcd4d0c621b577fc6477b83fb3e4653668bb3f4c2", "check": true, "userType": false },
  { "user": "0x2557794bf452ec0a9cb923b03b2d2fb550e17357", "check": true, "userType": false },
  { "user": "0x477763584467feead3b77e0623ec04153552d3bb", "check": true, "userType": false },
  { "user": "0xa36362a58bb0b52932fa8b23733b459a6a242d65", "check": true, "userType": false },
  { "user": "0xfaeb6d74bf4aa6fa096ec02f4c8c0a6c4ea6598d", "check": true, "userType": false },
  { "user": "0x67bc83836777dbae169cff9cb31a5d2beadeecab", "check": true, "userType": false },
  { "user": "0xe2abd1e57c8d6f0d21645a8a0af6c4251a4395f5", "check": true, "userType": false },
  { "user": "0xcd5691ea878d262516be278cb46f2fd7ff132083", "check": true, "userType": false },
  { "user": "0x9b63f0cef479924e5d2c4e22dbe31e6d0353b448", "check": true, "userType": false },
  { "user": "0xaada98978453263132587d0805c4a17376af9f13", "check": true, "userType": false },
  { "user": "0x55ef996639b608a25ab4293f39247a9e23411d3a", "check": true, "userType": false },
  { "user": "0x1b3c3d190c796a264c43dd5f1336af5ae4343cd2", "check": true, "userType": false },
  { "user": "0x556d216055a017adacb871e540d7e1ef41fda26d", "check": true, "userType": false },
  { "user": "0xa8d91b470c8e7e2dde59ec4b7d393efe37a290f7", "check": true, "userType": false },
  { "user": "0x8a4673b00b04b59cac44926abeda85ed181fa436", "check": true, "userType": false },
  { "user": "0xf5377262f68d386f265f4624a75f3b3a963877ef", "check": true, "userType": false },
  { "user": "0xe5beab7853a22f054ef287ea62ace7a32528b3ee", "check": true, "userType": false },
  { "user": "0x565ac0e8fe74f5052520d6f49f0cbc0bff7df069", "check": true, "userType": false },
  { "user": "0x7af675e0cf99444db59e2f75c1663c261e9f2420", "check": true, "userType": false },
  { "user": "0x5a9fad3222e4ce8adc7e9861e4bdda9adbc96156", "check": true, "userType": false },
  { "user": "0x4d5faa28c8c88fcc19c1f2b302694ff1c899be5e", "check": true, "userType": false },
  { "user": "0x154d58d4ad8e3b6715cea07e7a5d701244f1a0a6", "check": true, "userType": false },
  { "user": "0xb01c7058f7f5232ec8399a9078fec313a1e8ceb5", "check": true, "userType": false },
  { "user": "0x6e3de3f6b0ee2358cfd33c4d2f4822d5e4bfac1b", "check": true, "userType": false },
  { "user": "0x77b3f5b4f830b5c2e1e0b8444e8a791272ef6cf9", "check": true, "userType": false },
  { "user": "0xe9ce8d3307344e44ca2a4974aab33fd4ab5ca2d2", "check": true, "userType": false },
  { "user": "0xcef60431a20386e59c1da0c67d701dcf393e044f", "check": true, "userType": false },
  { "user": "0x058f455880a4529174e9e5bc985c84de7209eafc", "check": true, "userType": false },
  { "user": "0x202b3b724ebcbb4a3b23dcb09ac492343f327a61", "check": true, "userType": false },
  { "user": "0x0ecfa2395449cb032bbc317020b02c2f9b07faa9", "check": true, "userType": false },
  { "user": "0x4ebc79792f66db4f2237ce6a3df60a3d215a3a4c", "check": true, "userType": false },
  { "user": "0xe54cc59bba6f37816cc9b1c2176a863f866a2045", "check": true, "userType": false },
  { "user": "0xebc9c23d79a08ed2f8043b9128892db42c870a6a", "check": true, "userType": false },
  { "user": "0x26558784323f5b9c6d25020dabdd40b5a6e113ac", "check": true, "userType": false },
  { "user": "0x30ec5397f694b45ac99964c24393c0be1d451d0a", "check": true, "userType": false },
  { "user": "0x6b3b876ffe4d1101bf4af252bfc4fd579cb7362f", "check": true, "userType": false },
  { "user": "0x4658a86a974e4b451378745536f3ffd5540825a7", "check": true, "userType": false },
  { "user": "0x5911f3ed1eb71cc31b8c6e44141f218512dfc696", "check": true, "userType": false },
  { "user": "0xdad3fe28b0369d4e18000d0b21d23250690dcfdf", "check": true, "userType": false },
  { "user": "0xbc469fd29383d1861019038aa6e6d00960a68bc6", "check": true, "userType": false },
  { "user": "0xd4857fbab06f172e897094cb8cead496f347ddc9", "check": true, "userType": false },
  { "user": "0x840bb9c3cfa8acfc8291cc894a5331faa90b6250", "check": true, "userType": false },
  { "user": "0x1f87e44c14775165a49f950009dd318d8897c454", "check": true, "userType": false },
  { "user": "0x091374c3a440f8909046637b8407f3d1a0ff84b8", "check": true, "userType": false },
  { "user": "0xae332c24b47688c0aaa8d52f4739c423998ab00a", "check": true, "userType": false },
  { "user": "0xba2940d5d1eb1fbd55e7e751a44dbfb672e94b43", "check": true, "userType": false },
  { "user": "0x67b9a7cad90cc113275f6a06a35c54f494fcf5be", "check": true, "userType": false },
  { "user": "0xa250540428f7d6f6b98b10bb416db262360957e4", "check": true, "userType": false },
  { "user": "0xfd55abcf814f4b4ed68f2a7828fb4ba48ee9a737", "check": true, "userType": false },
  { "user": "0xf5c49c16b097630f8f7312ebab4b1618e6c7662f", "check": true, "userType": false },
  { "user": "0xe47c43afaf468e8149b384c1d7b05e990d7bc444", "check": true, "userType": false },
  { "user": "0xec04082a4892a19654443d79b286beca1c28eadd", "check": true, "userType": false },
  { "user": "0x6eb1949963a1b8a77b3d4ee2ede66173976612f4", "check": true, "userType": false },
  { "user": "0x7333ed521d675fdd15ae459fccac3b4d9763f50d", "check": true, "userType": false },
  { "user": "0x737a33b2e8e0578a1416b71ff2b33e51a0c770da", "check": true, "userType": false },
  { "user": "0x900e0a0397749aaffc9f5f214cfd65de15beb234", "check": true, "userType": false },
  { "user": "0x49d46ac4da15b1822ad5f567796e3d3abcec08a4", "check": true, "userType": false },
  { "user": "0xb80b60e35d374d20fc5eef86cd2de9382959e4b7", "check": true, "userType": false },
  { "user": "0xca5bf6ad85a06dd38dd9c3f7ece13b9397aa4c1f", "check": true, "userType": false },
  { "user": "0xe3b8e68393c8b3a76a6ff199e7502a69770abe92", "check": true, "userType": false },
  { "user": "0x18efc228e435540eebabeda2b7bb03a25f8baea3", "check": true, "userType": false },
  { "user": "0x46636c9be1d42754b3442dfd0199c1c315d9a80a", "check": true, "userType": false },
  { "user": "0xa7d5cf2aa862ce63d4572abb0817e357b5cff881", "check": true, "userType": false },
  { "user": "0x0db6e8eaf3383a029df4749a717fb4431554da0c", "check": true, "userType": false },
  { "user": "0x2ffa01b4b6b9b76c0bf9409593ba0035366bb8e0", "check": true, "userType": false },
  { "user": "0xf63f0b3ad26a99643a5a0c13e0fc54aa4a910477", "check": true, "userType": false },
  { "user": "0x32174b283b7cd23ccb75943dcf6661303f9c6514", "check": true, "userType": false },
  { "user": "0x57388c23704ee63439240069b9830eca8da0e736", "check": true, "userType": false },
  { "user": "0xe8e057ee0780308e993830dbc8dabbe26c0d907d", "check": true, "userType": false },
  { "user": "0x0f254177180f8bda7e6ab9f3765845294453e56c", "check": true, "userType": false },
  { "user": "0xf06e74ce7b0fae11d326f9916b206d9f44a6d8f8", "check": true, "userType": false },
  { "user": "0x773852214d6c266895d3507fec83cde8f7d4aa72", "check": true, "userType": false },
  { "user": "0x7bd1230d2159d8d96022d10922e7d53ddb88df42", "check": true, "userType": false },
  { "user": "0x799c44d6b02493fcc207a75b733861eefab3a05e", "check": true, "userType": false },
  { "user": "0x36d1a5f2f74a2f829ca91762d91498aae6337b74", "check": true, "userType": false },
  { "user": "0x6d3b1a88053655a9be36c13e7adf050a3eaa5dcf", "check": true, "userType": false },
  { "user": "0x27d18b98e74ce581cfa08dd73b1d171b38ac69c2", "check": true, "userType": false },
  { "user": "0x036b9d622a5a8325c5645839c7abbc072eddf5e8", "check": true, "userType": false },
  { "user": "0x666a6065fca13d428d0cf91f17a38a0365e7d41b", "check": true, "userType": false },
  { "user": "0x3564cca1102676a7fe45bf95faa0a332bce06305", "check": true, "userType": false },
  { "user": "0x002cb246e74403bd553253dc255a5cef443278ca", "check": true, "userType": false },
  { "user": "0xc37f1aa3a34bdf463736133a22953c6c7ae7b7e2", "check": true, "userType": false },
  { "user": "0x3512729f1032de2e7eb1819c66f872e892b9f317", "check": true, "userType": false },
  { "user": "0x5a90a034d8ad5ae441d03cbd8637cec4a3622b4e", "check": true, "userType": false },
  { "user": "0xf3b786b3e598e10a187236603a0eaba073faa361", "check": true, "userType": false },
  { "user": "0x2971877dea93ffd7b40b6c8edf60b06180265bcf", "check": true, "userType": false },
  { "user": "0xe514acda093a1e9261a8f96958993723b422eea0", "check": true, "userType": false },
  { "user": "0xfac9fb53e1be5fd9eec357f351efcf61ca70ea6f", "check": true, "userType": false },
  { "user": "0x6a082fcd074bf2669de247dcea51f2786d2911e8", "check": true, "userType": false },
  { "user": "0x2b52eb5662f6cbbd2c45001d003927905a3d0fa2", "check": true, "userType": false },
  { "user": "0x3b59d0edc709b0774e3ddfef3ec5540c65f94b7e", "check": true, "userType": false },
  { "user": "0x156033c05cb236cc1741a523f57b94216955442a", "check": true, "userType": false },
  { "user": "0x0f311c82f6e5a7874a7dcb8daa98e3abd2c78d31", "check": true, "userType": false },
  { "user": "0xd5031fa6e2e1b9942d7104cb3f852235c540fe1a", "check": true, "userType": false },
  { "user": "0x09314dac77ff8c9f9689a853ef41b7d4c133440d", "check": true, "userType": false },
  { "user": "0x66b8448ed4f2ad8df5cd481b37526797877ab210", "check": true, "userType": false },
  { "user": "0x08a14f70b4bc7f46e172ad6795516405eb88f1eb", "check": true, "userType": false },
  { "user": "0x854a7d55c845dd0363c3cb4f2dabd79c10697cf2", "check": true, "userType": false },
  { "user": "0x00dd7939597bc43820ffb2b4e834f26924012b3d", "check": true, "userType": false },
  { "user": "0xb6958d92ff436fa5d7ea550a22283fe9eaf458e9", "check": true, "userType": false },
  { "user": "0xf40fcb5937ab8abd4685e0ad10a5e971ce23ae3d", "check": true, "userType": false },
  { "user": "0x0318ef1295c6fefb4946618f111103f5798707fb", "check": true, "userType": false },
  { "user": "0x4d40b1b3b5755ee94b3ae28e8ae77727c77c4626", "check": true, "userType": false },
  { "user": "0xfbc6ee4cc10b0be0beb2e25d45e49b8434669d40", "check": true, "userType": false },
  { "user": "0xde4ffb04b6c02061f9f2246239a974e4f3ea4d4c", "check": true, "userType": false },
  { "user": "0x75fe4ffc0e15bd7343fdaa1f4deedbbcdd5d6e33", "check": true, "userType": false },
  { "user": "0xde9e1df2c6c17c53c5057c38ef41f5a113238ddb", "check": true, "userType": false },
  { "user": "0x863218e6adad41bc3c2cb4463e26b625564ea3ba", "check": true, "userType": false },
  { "user": "0x4e8d10c30b7ea887554a32306d284a35ebec95d5", "check": true, "userType": false },
  { "user": "0x322063c208b66eeb5f48a56f0cec95803953cf9b", "check": true, "userType": false },
  { "user": "0x5aa43edba1165fcde0ef7abc831bd428e55a5ed7", "check": true, "userType": false },
  { "user": "0xfddf07a065e19a18d6cb21d5945fde723d8cf04d", "check": true, "userType": false },
  { "user": "0x827deb0eaa637c7ebe38a5ef0137f03b0e638037", "check": true, "userType": false },
  { "user": "0x397f2f317cba20a108d983eeaa5d2ebd8f540384", "check": true, "userType": false },
  { "user": "0x9b3da7e84060a2340ffcd3896473005fbc15bd10", "check": true, "userType": false },
  { "user": "0xa329cf288be203e4d74b4cdf798abc6d59d080b0", "check": true, "userType": false },
  { "user": "0xd2bfaccfaaae3d0d9b080ab8c0b917447c51552b", "check": true, "userType": false },
  { "user": "0x9e1551a3b9215e0f7db8812b1cd2e62adf9c9090", "check": true, "userType": false },
  { "user": "0x9d3dae4b6a1346bd130d96a434b492c629bdbc33", "check": true, "userType": false },
  { "user": "0x66d95dc35a493567d9b7de5fd2d97d8ea6bd4db4", "check": true, "userType": false },
  { "user": "0x8bf76954ad41e00f8a5c9d42d0f63e650a267b43", "check": true, "userType": false },
  { "user": "0x78ac7fde50adc2348794a49cea850522385505ec", "check": true, "userType": false },
  { "user": "0x4a2a701764a9716503fb4cb2c3decb07d3baeab4", "check": true, "userType": false },
  { "user": "0xbe06c3eeb78d23a76ec4d057f0861a6da8b47eaa", "check": true, "userType": false },
  { "user": "0x5bffc5de763ee6433cc7196e9290ac457ab68cb7", "check": true, "userType": false },
  { "user": "0x96fe4c8042b48ef9cb33530f94d5f0916031eb9d", "check": true, "userType": false },
  { "user": "0x4705dc1c66f91b713e06416d71d1e21370eb50ac", "check": true, "userType": false },
  { "user": "0x6e8ffde69d8574c11cef75369bef07cef448beb0", "check": true, "userType": false },
  { "user": "0x25c3f1035f2db92ea79072fdd76b64f71178f7ec", "check": true, "userType": false },
  { "user": "0xadc86b12c5a3a7d1e99a4282ef48eb9e56e174a4", "check": true, "userType": false },
  { "user": "0xd4000432d439868080e97e60e4a4212355ced41a", "check": true, "userType": false },
  { "user": "0xe37a8a00958c3945da99cabcfe974470c93021f6", "check": true, "userType": false },
  { "user": "0xc8b6092c64ad07b828922c99d29ad6fed1529930", "check": true, "userType": false },
  { "user": "0x45eea58d15ce66b9f7e59bd37cf8f787a059f154", "check": true, "userType": false },
  { "user": "0xc25cdc60ae65736c79ec4626a6440a2c651d91dd", "check": true, "userType": false },
  { "user": "0xc919466e4fb98717df62388f3b8a1cc815ac65ef", "check": true, "userType": false },
  { "user": "0x2d66e498cb3e6657ac16a0931da2372779ef640b", "check": true, "userType": false },
  { "user": "0xc679a52ed35ac5ac1c8bc41f7294f0b1b8c13882", "check": true, "userType": false },
  { "user": "0x26276fd23781a716cd10ed27ff4ed8c3ce65e140", "check": true, "userType": false },
  { "user": "0xb2dcc4962af873feb2a987f10f3871b8597cb7f5", "check": true, "userType": false },
  { "user": "0x1a8228a4e71fa46a3006ea768933458ef7d30fe5", "check": true, "userType": false },
  { "user": "0x49fbd4ed0bde499afd8fed0cad05bd62f34bed7a", "check": true, "userType": false },
  { "user": "0x6b661ee83e6ea59a8e63f8797f55286bfd4d9506", "check": true, "userType": false },
  { "user": "0x2110f638ae1fa85950bf17161176ea94468c3ba0", "check": true, "userType": false },
  { "user": "0xd8838989991909f032b4b4438896f6ffbfc8a89d", "check": true, "userType": false },
  { "user": "0x6006d1ab16184b8263ef653a3d548814e17d27d5", "check": true, "userType": false },
  { "user": "0xd65bcde62c36f039da246fb85e95d2dfdee4e414", "check": true, "userType": false },
  { "user": "0x16371f1e538ace91f909fe4f83d3405c6691053d", "check": true, "userType": false },
  { "user": "0x8d9162b06b1df701e5ba1d10e5deb28ee2deaf88", "check": true, "userType": false },
  { "user": "0xc08a5a0faf803b586288adf8d397ca8709da024f", "check": true, "userType": false },
  { "user": "0x2afcaa4766226f1dd809b52ad34fb02900d2748d", "check": true, "userType": false },
  { "user": "0xb994c0d44d2065bf95fee15a16a565723666e3ae", "check": true, "userType": false },
  { "user": "0x9001dcf410755d30654edd0c9f40ff5acb1f70bf", "check": true, "userType": false },
  { "user": "0x701eaaa548c4614026e6a2870b57bcb2ca108ad3", "check": true, "userType": false },
  { "user": "0x7374c161ca6df696a9d99f2a28fd152dc846fd6d", "check": true, "userType": false },
  { "user": "0x5fbe3e41d9529f5e3d26caccb7e597725426fbf0", "check": true, "userType": false },
  { "user": "0x6172f71595cf4fcc8321551a7e14b1ae4b6386a8", "check": true, "userType": false },
  { "user": "0x17dad752b9b470d960cfd7785846ee6dee3ba058", "check": true, "userType": false },
  { "user": "0x396881ccecdb42632fe6ed788cf1de289645d2e2", "check": true, "userType": false },
  { "user": "0xbbab04d10ba6b745dcbac419cb4eb0a75ce7ca87", "check": true, "userType": false },
  { "user": "0x2e4a74a5c1743dd41d6b2e9aa061494aae4434bf", "check": true, "userType": false },
  { "user": "0xd7e8e9c8b80ebf31a48c5381d38c0d73a1758033", "check": true, "userType": false },
  { "user": "0x04bbf30f5363fe8458916a324c8342de4cec237f", "check": true, "userType": false },
  { "user": "0xa0121fbbbaa054e2169c39da9bba438e9b737d87", "check": true, "userType": false },
  { "user": "0x2351132b26e7bb6b066e6fc7e198e67c7d51932e", "check": true, "userType": false },
  { "user": "0x6eb0ce8561089f7beba1e00efaa265d5ca97288a", "check": true, "userType": false },
  { "user": "0xce8a0a61c1eed440a24ec3d40247b87f72513e31", "check": true, "userType": false },
  { "user": "0x0ae8ad869f38e24403b546bea23a5735f9abaecd", "check": true, "userType": false },
  { "user": "0xb37a9b65c2e71c4a312ac837d0781de2f08ababc", "check": true, "userType": false },
  { "user": "0xbe42916aa0cd2ecc7358be03e59d4b35fd2cb1e8", "check": true, "userType": false },
  { "user": "0x0d7fa976af5c34160806c602e92a9cc5eda7d1da", "check": true, "userType": false },
  { "user": "0x645ee23fbc2d0cb08c564fa570fd897505080e17", "check": true, "userType": false },
  { "user": "0x6d0778092518498506f19a15bdf3f8e1d2632622", "check": true, "userType": false },
  { "user": "0x7b2b82ea91819493105066022bc09c4913635756", "check": true, "userType": false },
  { "user": "0xb6714d77b7d385c1504cbf6406a5579dac711c7c", "check": true, "userType": false },
  { "user": "0x0d6878c5fdd418a0b81e3f29d4f0b24c48b001e4", "check": true, "userType": false },
  { "user": "0x8b5fa36c21d751db989163fbb3ea6dc78e337b8b", "check": true, "userType": false },
  { "user": "0xe85cc869e8841bf891d76c5641cff25afba2d6f4", "check": true, "userType": false },
  { "user": "0x64e1726fad93be59a5e54037bb56f82e4217f2a6", "check": true, "userType": false },
  { "user": "0x5a657df2310157c07820fa51ed7d0cbc6241542d", "check": true, "userType": false },
  { "user": "0x4c96dc6d6e03c7e3a2fd0e0ddaa51dcfeb32964e", "check": true, "userType": false },
  { "user": "0x257675fddddf23b8d8d73c8c660c980aeb540060", "check": true, "userType": false },
  { "user": "0x3c96d50e5714768b652f33458f547a63750b6693", "check": true, "userType": false },
  { "user": "0xf4923a2264246532586350a639e59ab042192f9d", "check": true, "userType": false },
  { "user": "0xc027ca3fe4874a4f18f4a1d3e452ec74e4699b68", "check": true, "userType": false },
  { "user": "0x1fde2a968db3289a348013f9bb96e8d9f0ac50f8", "check": true, "userType": false },
  { "user": "0x80bd0ce658663ac0921a393f0a07c84875d13166", "check": true, "userType": false },
  { "user": "0x0528dcdbeacbd77fa7b0d2769efb906bb925fe2b", "check": true, "userType": false },
  { "user": "0xec6701e30d24f14348f8706efe0fbd359da54871", "check": true, "userType": false },
  { "user": "0xec39a781ed5add10fb76243088a220c7ad78cc73", "check": true, "userType": false },
  { "user": "0xc2a69354f5f76c6e93f823ede8ca3e599dba57a1", "check": true, "userType": false },
  { "user": "0x55ff96496cfde24bacfcefaca22c625adeca05a7", "check": true, "userType": false },
  { "user": "0x158dbbcc911eee7b56f2fc71f167952602685aa8", "check": true, "userType": false },
  { "user": "0x5e6e7bce22571e2cd5e4764b10bfa38c76fbb5d7", "check": true, "userType": false },
  { "user": "0x22bb7fc72f045ec0cf5377b6354f37f48ee99b0a", "check": true, "userType": false },
  { "user": "0xf9b4eaab82202d7cc2fb961d1846a223d2cd9464", "check": true, "userType": false },
  { "user": "0xe9e66755ffaeea84c1e978a1c4c37066418d9216", "check": true, "userType": false },
  { "user": "0x2379118257b27d0904a8da3a7046eed82031b501", "check": true, "userType": false },
  { "user": "0x645c3e66296eedebf3994bbe4184e46d1430baa6", "check": true, "userType": false },
  { "user": "0xdd75c65eed1e304c2217a8cfb1bd437789da1b25", "check": true, "userType": false },
  { "user": "0xd1600417c4c07132f368ffa97c245901d73790ee", "check": true, "userType": false },
  { "user": "0x3cc17e222a329b8bee6a0ae054f33519da700e10", "check": true, "userType": false },
  { "user": "0x73a6d24527f1e99c08f6eaaf882ddd570e47151c", "check": true, "userType": false },
  { "user": "0xd945517c61cbd2cb77cbb728c174a147884fc6a4", "check": true, "userType": false },
  { "user": "0xda38d34202eb9018a846bb716fb65e39fc2fdab6", "check": true, "userType": false },
  { "user": "0x75de84a99744d4b1ea45e202d979d89d47b58c18", "check": true, "userType": false },
  { "user": "0xb0033245Dc385fa302c626fe67BCAE0F8fE8Ce4E", "check": true, "userType": false }
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://testnet.aurora.dev/");
  const deployerWallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractFatory = new ethers.Contract(
    "0xd7EB7C191802954177F605227091e32c15f940a0", // HoundLaama contract address
    HoundLaamaABI.abi,
    deployerWallet
  );

  let nonce;
  let previousNonce;
  /* set allow to access to airdrop 400 nfts */
  for (let i = 0; i < 40; i++) {
    nonce = await provider.getTransactionCount(deployerWallet.address);
    if (i > 0) {
      if (previousNonce != nonce - 1) {
        nonce = previousNonce + 1;
      }
    }
    previousNonce = nonce;
    console.log(`nonce ${i}: `, nonce);
    await contractFatory.connect(deployerWallet).setAirdropOrWhitelistUser(
      randomAirdropAddressList.slice(10 * i, 10 * (i + 1)),
      { nonce: nonce }
    );
  }

  /* mint airdrop 400 nfts */
  for (let i = 197; i < 400; i++) {
    nonce = await provider.getTransactionCount(deployerWallet.address);
    if (i > 197) {
      if (previousNonce != nonce - 1) {
        nonce = previousNonce + 1;
      }
    }
    previousNonce = nonce;
    console.log(`nonce ${i}: `, nonce);
    await contractFatory.connect(deployerWallet).airdropOrWhitelistMint(
      1,
      randomAirdropAddressList[i].user,
      { nonce: nonce }
    )
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});