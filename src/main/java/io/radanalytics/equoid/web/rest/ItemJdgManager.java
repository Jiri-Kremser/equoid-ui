package io.radanalytics.equoid.web.rest;

import io.radanalytics.equoid.domain.Item;
import org.infinispan.client.hotrod.RemoteCache;
import org.infinispan.client.hotrod.RemoteCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemJdgManager {

    private final Logger log = LoggerFactory.getLogger(ItemJdgManager.class);

    private final RemoteCacheManager cacheManager;

    @Autowired
    public ItemJdgManager(RemoteCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public List<Item> getAll() {
        RemoteCache<String, Long> cache = cacheManager.getCache();
        Map<String, Long> all = Collections.emptyMap();
        if (cache != null) {
            all = cache.getBulk();
            log.debug("Successfully retrieved " + all + " from ISPN cache");
        } else {
            log.error("Unable to access infinispan cache");
        }
        return all
            .entrySet()
            .stream()
            .map(entry -> new Item(entry.getKey(), entry.getValue()))
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

}
