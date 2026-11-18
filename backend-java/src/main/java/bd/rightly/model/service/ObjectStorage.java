package bd.rightly.model.service;

import java.io.InputStream;

public interface ObjectStorage {

    void put(String key, InputStream content, long size, String contentType);

    ObjectStat stat(String key);

    record ObjectStat(boolean exists, long size, String contentType) {}
}