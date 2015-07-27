## Redis database data structure

":" is used as a delimiter, and common practice of using "object-type:id" is used.

### Schema

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

posts - set of all posts, type=sorted set
user:<USER_ID>:posts - set of all posts by this user, type=sorted set