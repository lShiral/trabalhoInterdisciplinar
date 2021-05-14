create database if not exists LOLHelper;
use LOLHelper;
create table Usuario(
id int auto_increment primary key,
email varchar(60) not null unique,
nomeUsuario varchar(60) not null,
senha varchar(60) not null,
fezQuiz boolean Default(False),
imagem varchar(90) default("/public/images/banner.svg")
);

create table Quiz(
idQuiz int auto_increment primary key,
respostas varchar(120) not null,
idUsuario int,
foreign key (idUsuario) references Usuario (id)
);

create table Jogabilidade( 
 idJog int, 
 rota varchar(60) not null,
 funcao varchar(60) not null, 
 foreign key (idJog) references Usuario (id), 
 primary key(idJog) 
 );

create table Campeoes(
id_jog int,
nomeCampeao varchar(60) not null,
idcampeao int not null primary key,
foreign key (id_jog) references Jogabilidade (idJog)
);

create table Administrador(
idAdm int auto_increment primary key,
emailAdm varchar(60) not null unique,
nomeAdm varchar(60) not null,
senha varchar(60) not null
);


