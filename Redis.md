## Redis database data structure

":" is used as a delimiter, and common practice of using "object-type:id" is used.

### Schema

site - instance info, type=hash
- type (for now, always "blog")
- title
- description

user:<USER_ID> - user profile, type=hash
- password
- name

post:<POST_ID> - blog post, type=hash
- shorturl
- title
- abstract
- content
- ts
- published
- tags
- headerimg

posts - set of all posts (by id), type=sorted set
user:<USER_ID>:posts - set of all posts (by id) by this user, type=sorted set