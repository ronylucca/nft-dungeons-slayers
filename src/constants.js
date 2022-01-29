const CONTRACT_ADDRESS = "0x14e52c9e0baD8f4F5C05fE55Dbf7ECAC129F55A7";
//0x00d2e9Bad0f1F732650bc8B36758bfC1Fc33931F

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
