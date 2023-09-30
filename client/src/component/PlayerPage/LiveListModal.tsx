import { Modal, Backdrop, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import styles from "./LiveListModal.module.css";
import axios from "axios";
import AlertModal from "../Common/AlertModal";
import React from "react";

type MusicItem = {
  albumCoverUrl: string;
  artist: string;
  title: string;
  musicId: number; // 이 부분을 추가했습니다.
};

type OncastItem = {
  nickname: string;
  profileImage: string;
  title: string;
  musicList: MusicItem[];
};

type LiveListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  oncastList: OncastItem[];
  currentStory: number; // 현재 재생 중인 사연의 순서
};

export const LiveListModal: React.FC<LiveListModalProps> = ({
  isOpen,
  onClose,
  oncastList,
  currentStory,
}) => {
  const [alertModalOpen, setAlertModalOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleAddClick = (musicId: number) => {
    if (!musicId) {
      console.error("No musicId provided!");
      return;
    }
    axios
      .post(
        "http://localhost:8080/api/playlist/music",
        {
          musicId: musicId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      )
      .then(response => {
        if (
          response.data.message === "이미 플레이리스트에 추가된 음악입니다."
        ) {
          setAlertMessage("이미 플레이리스트에 추가된 음악입니다.");
          setAlertModalOpen(true);
        } else {
          setAlertMessage("추가되었습니다.");
          setAlertModalOpen(true);
        }
      })
      .catch(error => {
        console.error("Error adding music to playlist", error);
      });
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
        className={styles.modalContainer}
      >
        <Fade in={isOpen}>
          <div className={styles.paper}>
            <button className={styles.closeButton} onClick={onClose}>
              x
            </button>
            <h2>온캐스트 편성표</h2>
            <hr />
            <div className={styles.oncastList}>
              {oncastList.map((oncast, index) => (
                <div
                  key={index}
                  className={`${styles.oncastItem} ${
                    index === currentStory ? styles.currentOncast : ""
                  }`}
                >
                  <div className={styles.profileAndDetails}>
                    <img
                      src={oncast.profileImage}
                      alt={oncast.nickname}
                      className={styles.profileImage}
                    />
                    <div className={styles.oncastDetails}>
                      <span className={styles.nickname}>{oncast.nickname}</span>
                      <span className={styles.title}>{oncast.title}</span>
                    </div>
                  </div>
                  <ul className={styles.musicList}>
                    {oncast.musicList.map((music, mIndex) => (
                      <li key={mIndex} className={styles.musicItem}>
                        <img
                          src={music.albumCoverUrl}
                          alt={music.title}
                          className={styles.albumCover}
                        />
                        <div className={styles.musicDetails}>
                          <span className={styles.songTitle}>
                            {music.title}
                          </span>
                          <span className={styles.artist}>{music.artist}</span>
                        </div>
                        <AddCircleOutlineIcon
                          className={styles.addIcon}
                          onClick={() => handleAddClick(music.musicId)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </Modal>
      <AlertModal
        open={alertModalOpen}
        message={alertMessage}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
};
