package io.radanalytics.equoid.web.rest;

import io.radanalytics.equoid.domain.Item;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.infinispan.client.hotrod.RemoteCache;
import org.infinispan.client.hotrod.RemoteCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
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

    public List<Item> getAll() {
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
                return handleNSecondsData((String) item.getKey(), (String) item.getValue());
            } else if (item.getKey() instanceof String && item.getValue() instanceof String) {
                log.info("trying to handle the 'interval -> string' format");
                return handleIntervalData(all);
            }
        }

        return all
            .entrySet()
            .stream()
            .flatMap(entry -> {
                if (entry.getValue() instanceof Long && entry.getKey() instanceof String) {
                    return Stream.of(new Item((String) entry.getKey(), (Long) entry.getValue()));
                } else {
                    log.error("Broken contract when trying to retrieve items of type (String -> Long)");
                    log.error("entry: " + entry);
                    log.error("type of key: " + entry.getKey().getClass().getCanonicalName());
                    log.error("type of value: " + entry.getValue().getClass().getCanonicalName());
                    return Stream.empty();
                }
            })
            .collect(Collectors.toList());
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

    private List<Item> handleNSecondsData(String interval, String data) {
        log.info("retrieving the data for last " + interval);
        return parseData(data);
    }

    private List<Item> parseData(String data) {
        if (data.contains(";")) {
            String[] items = data.split(";");
            if (items.length > 0) {
                List<Item> retList = Arrays.stream(items).flatMap(item -> {
                    if (item.contains(":")) {
                        String[] itemChunks = item.split(":");
                        if (itemChunks.length == 2) {
                            try {
                                long count = Long.parseLong(itemChunks[1]);
                                return Stream.of(new Item(itemChunks[0], count));
                            } catch (NumberFormatException nfe) {
                                log.error("case 1");
                                return Stream.empty();
                            }
                        } else {
                            log.error("case 2");
                            return Stream.empty();
                        }
                    } else {
                        log.error("case 3");
                        return Stream.empty();
                    }
                }).collect(Collectors.toList());
                if (retList.isEmpty()) {
                    log.error("case 3.5");
                }
                return retList;
            } else {
                log.error("case 4");
                return Collections.emptyList();
            }
        } else {
            log.error("case 5");
            return Collections.emptyList();
        }
    }

    // todo: delete me
    // this is here to handle the implementation that has been deprecated
    private List<Item> handleIntervalData(Map<Object, Object> all) {
        List<ImmutablePair<Integer, String>> list = all.entrySet().stream()
            .flatMap(entry -> {
                try {
                    int interval = Integer.parseInt((String) entry.getKey());
                    return Stream.of(new ImmutablePair<Integer, String>(interval, entry.getValue().toString()));
                } catch (NumberFormatException nfe) {
                    log.error("case 0");
                    return Stream.empty();
                }
            })
            .collect(Collectors.toList());
        if (list.isEmpty()) {
            log.error("case 0.5");
            return Collections.emptyList();
        }
        ImmutablePair<Integer, String> latestState = Collections.max(list, Comparator.comparingInt(ImmutablePair::getLeft));
        return parseData(latestState.getRight());
    }

}
