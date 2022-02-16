INSERT OR IGNORE INTO Users (email,password_hash,admin,client_id,notifications) 
  VALUES ('admin@admin.com','pbkdf2:sha256:150000$u0MxI5k3$e703c3b3c58e473ca6c6b5787df2073022558dcfeb699868d157ee1e1a078967',1,11,1);
INSERT OR IGNORE INTO Users (email,password_hash,admin,client_id,notifications)
  VALUES ('test@test.com','pbkdf2:sha256:150000$iPv4ySh2$c5f41118c440a44609c1f95f3d860e43773aa5e109ef4ae05b8ceea8e98ab977',0,3,1);
INSERT OR IGNORE INTO Users (email,password_hash,admin,client_id,notifications)
  VALUES ('zack@wongworks.net','pbkdf2:sha256:150000$iPv4ySh2$c5f41118c440a44609c1f95f3d860e43773aa5e109ef4ae05b8ceea8e98ab977',0,3,1);
