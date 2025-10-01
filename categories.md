---
layout: page
title: "Categories"
subtitle: "Posts organized by category"
permalink: /categories/
---

<div class="content">
    {% assign sorted_categories = site.categories | sort %}
    {% for category in sorted_categories %}
        <h2 id="{{ category[0] | slugify }}" class="title is-4">
            <span class="tag is-primary is-medium">{{ category[1] | size }}</span>
            {{ category[0] }}
        </h2>
        
        <div class="columns is-multiline">
            {% for post in category[1] %}
                <div class="column is-6-tablet is-4-desktop">
                    <div class="card">
                        {% if post.image %}
                            <div class="card-image">
                                <figure class="image is-3by2">
                                    <img src="{{ post.image }}" alt="{{ post.title }}">
                                </figure>
                            </div>
                        {% endif %}
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-6">
                                        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
                                    </p>
                                    <p class="subtitle is-7">{{ post.date | date: '%B %d, %Y' }}</p>
                                </div>
                            </div>
                            {% if post.excerpt %}
                                <div class="content is-size-7">
                                    {{ post.excerpt | strip_html | truncate: 120 }}
                                </div>
                            {% endif %}
                        </div>
                    </div>
                </div>
            {% endfor %}
        </div>
        
        <hr class="my-5">
    {% endfor %}
</div>

<style>
.card {
    height: 100%;
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-image img {
    object-fit: cover;
    height: 150px;
}
</style>