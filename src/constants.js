const CONTRACT_ADDRESS = '0x00d2e9Bad0f1F732650bc8B36758bfC1Fc33931F';


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