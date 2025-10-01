---
layout: page
title: "Tags"
subtitle: "Posts organized by tags"
permalink: /tags/
---

<div class="content">
    {% assign sorted_tags = site.tags | sort %}
    {% for tag in sorted_tags %}
        <h2 id="{{ tag[0] | slugify }}" class="title is-4">
            <span class="tag is-info is-medium">{{ tag[1] | size }}</span>
            {{ tag[0] }}
        </h2>
        
        <div class="block">
            {% for post in tag[1] %}
                <div class="box">
                    <article class="media">
                        {% if post.image %}
                            <figure class="media-left">
                                <p class="image is-64x64">
                                    <img class="is-rounded" src="{{ post.image }}" alt="{{ post.title }}">
                                </p>
                            </figure>
                        {% endif %}
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>
                                        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
                                    </strong>
                                    <br>
                                    <small class="has-text-grey">{{ post.date | date: '%B %d, %Y' }}</small>
                                    <br>
                                    {% if post.excerpt %}
                                        {{ post.excerpt | strip_html | truncate: 200 }}
                                    {% endif %}
                                </p>
                            </div>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <div class="level-item">
                                        <span class="tags">
                                            {% for category in post.categories %}
                                                <span class="tag is-small">{{ category }}</span>
                                            {% endfor %}
                                        </span>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </article>
                </div>
            {% endfor %}
        </div>
        
        <hr class="my-5">
    {% endfor %}
</div>

<style>
.box {
    transition: box-shadow 0.2s ease-in-out;
}

.box:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.media-left img {
    object-fit: cover;
}

.tag.is-small {
    background-color: #f5f5f5;
    color: #363636;
}
</style>