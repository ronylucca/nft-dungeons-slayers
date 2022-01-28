/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";

const Arena = ({ characterNFT, setCharacterNFT }) => {
  //state
  const [gameContract, setGameContract] = useState(null);
  //state to hold our boss data
  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState("");

  //useEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log(`Boss: ${bossTxn}`);
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        alert(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Update both player and boss Hp
        */
        setBoss((prevState) => {
            return { ...prevState, hp: bossHp };
        });

        setCharacterNFT((prevState) => {
            return { ...prevState, hp: playerHp };
        });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContract]);

  // Actions
  const runAttackAction = async () => {
    try {
      if (gameContract) {
          setAttackState('attacking');
          console.log('Attacking Boss...');
          const attackTxn = await gameContract.attackBoss();
          await attackTxn.wait();
          console.log('attackTxn', attackTxn);
          setAttackState('Hit');
      }
    } catch (error) {
        console.error('Error attacking boss: ',error);
        setAttackState('');
    }
  };

  return (
    <div className="arena-container">
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥{boss.name}🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${boss.attackDamage}`}</h4>
            </div>
          </div>
          <div className="attack-container">
            <button className="cla-button" onClick={runAttackAction}>
              {`💥 Attacl ${boss.name}`}
            </button>
          </div>
          
          {attackState === 'attacking' && (
          <div className="loading-indicator">
            <LoadingIndicator />
            <p>Attacking ⚔️</p>
          </div>
          )}
        </div>
      )}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Arena;
