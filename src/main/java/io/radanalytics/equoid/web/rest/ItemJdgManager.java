package io.radanalytics.equoid.web.rest;

import io.radanalytics.equoid.domain.Item;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.infinispan.client.hotrod.RemoteCache;
import org.infinispan.client.hotrod.RemoteCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ItemJdgManager {

    private final Logger log = LoggerFactory.getLogger(ItemJdgManager.class);

    private final RemoteCacheManager cacheManager;

    @Autowired
    public ItemJdgManager(RemoteCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public Map<String, List<Item>> getAll() {
        RemoteCache<Object, Object> cache = cacheManager.getCache();
        Map<Object, Object> all = Collections.emptyMap();
        if (cache != null) {
            all = cache.getBulk();
            log.debug("Successfully retrieved " + all + " from ISPN cache");
        } else {
            log.error("Unable to access infinispan cache");
        }
        if (!all.entrySet().isEmpty()) {
            Map.Entry<Object, Object> item = all.entrySet().iterator().next();
            if (item.getKey() instanceof String && item.getValue() instanceof String && ((String) item.getKey()).endsWith("econds")) {
                log.info("trying to handle the 'N seconds -> string' format");
                return handleNSecondsData(all);
            }
        }
        return Collections.emptyMap();
    }



    public Item get(String name) {
        RemoteCache<String, Long> cache = cacheManager.getCache();
        if (cache != null) {
            long count = cache.get(name);
            log.debug("Successfully retrieved {" + name + " = " + count + "} from ISPN cache");
            return new Item(name, count);
        } else {
            log.error("Unable to access infinispan cache");
            return null;
        }
    }

    public void put(Item item) {
        RemoteCache<String, Long> cache = cacheManager.getCache();
        if (cache != null) {
            cache.put(item.getName(), item.getCount());
        }
    }

    private Map<String, List<Item>> handleNSecondsData(Map<Object, Object> data) {
        return data.entrySet().stream().map(entry -> {
            String key = (String) entry.getKey();
            String value = (String) entry.getValue();
            return new ImmutablePair<>(key, parse(value));
        }).collect(Collectors.toMap(e -> e.getLeft(), e -> e.getRight()));
    }

    private List<Item> parse(String value) {
        if (value.contains(";")) {
            String[] items = value.split(";");
            if (items.length > 0) {
                List<Item> retList = Arrays.stream(items).flatMap(item -> {
                    if (item.contains(":")) {
                        String[] itemChunks = item.split(":");
                        if (itemChunks.length == 2) {
                            try {
                                long count = Long.parseLong(itemChunks[1]);
                                return Stream.of(new Item(itemChunks[0], count));
                            } catch (NumberFormatException nfe) {
                                log.error("case 1 - nfe");
                                return Stream.empty();
                            }
                        } else {
                            log.error("case 2 - colon split the chunk into more or less than 2 pieces");
                            return Stream.empty();
                        }
                    } else {
                        log.error("case 3 - no colon in the chunk");
                        return Stream.empty();
                    }
                }).collect(Collectors.toList());
                if (retList.isEmpty()) {
                    log.error("case 4 - empty list");
                }
                return retList;
            } else {
                log.error("case 5 - empty array");
                return Collections.emptyList();
            }
        } else {
            log.error("case 6 - no semicolon in the data");
            return Collections.emptyList();
        }
    }

}
