package com.b302.zizon.domain.playlist.repository;

import com.b302.zizon.domain.playlist.entity.PlaylistMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistMetaRepository extends JpaRepository<PlaylistMeta, Long> {

    List<PlaylistMeta> findByUserUserId(Long id);

    Optional<PlaylistMeta> findByPlaylistMetaIdAndUserUserId(Long playlistMetaId, Long userId);
}
