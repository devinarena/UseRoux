CREATE DATABASE  IF NOT EXISTS `useroux` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `useroux`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: useroux
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `solutions`
--

DROP TABLE IF EXISTS `solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solutions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `scramble` varchar(255) NOT NULL,
  `posted` datetime DEFAULT NULL,
  `time` decimal(18,9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solutions`
--

LOCK TABLES `solutions` WRITE;
/*!40000 ALTER TABLE `solutions` DISABLE KEYS */;
INSERT INTO `solutions` VALUES (1,1,'Daily Solve 10-18-2021','This is the daily solve, try and complete it the best way you can!','U2 B2 D\' B R\' D F\' R U F2 L2 F2 L2 U2 F L2 B\' U2 B\' L2 U2','2021-11-24 02:08:32',NULL),(2,1,'World Record Solve','This is the world record solve.','F U2 L2 B2 F\' U L2 U R2 D2 L\' B L2 B\' R2 U2','2021-11-24 22:01:57',3.470000000),(14,1,'Test Solve','This is a test solve!','F2 U2 F2','2021-11-26 03:20:51',1.350000000),(15,1,'Soffias thing','I5s cool','M2 U M2 U2 M2 U M2 U2','2021-11-27 20:02:35',2.500000000);
/*!40000 ALTER TABLE `solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `steps`
--

DROP TABLE IF EXISTS `steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `steps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `solution_id` int NOT NULL,
  `step_number` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `text` longtext,
  `algorithm` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `steps`
--

LOCK TABLES `steps` WRITE;
/*!40000 ALTER TABLE `steps` DISABLE KEYS */;
INSERT INTO `steps` VALUES (2,1,1,'First Block','This algorithm solves the blue and white block on the left side.','Z\' Y\' U M\' L\' U L2 U\' L\' R\' U\' R U2 B'),(3,1,2,'Second Block','','U\' M\' U R U\' R M R U\' R\' M R\' U R'),(4,1,3,'CMLL','','U R\' U\' R\' F R F\' R U\' R\' U2 R'),(5,1,4,'4a','','M U\' M\' U\' M'),(6,1,5,'4b','','U\' M\' U2 M U M2 U\''),(7,1,6,'4c','','M U2 M U2'),(8,2,1,'2x2x3 + EO','','Z Y U R2 U\' F\' L F\' U\' L\''),(9,2,2,'F2L','','U\' R U R2 U R U2 R\' U R'),(10,2,3,'ZBLL','','U R\' U\' R U\' R\' U2 R'),(11,2,4,'AUF','','U'),(12,12,1,'First Steppp','F2 U2','Almost solves it!'),(13,12,2,'Second Step \\\"OwO\"','U2',''),(16,14,1,'First Step \'/','Almost solves it!','F2 U2'),(17,14,2,'Second Step \"OWO\"','There we go!','F2'),(18,15,1,'H Perm','Grjekfbrn','M2 U M2 U2 M2 U M2'),(19,15,2,'AUF','','U2');
/*!40000 ALTER TABLE `steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'devinarena','$2a$10$Cr37GBXUOQ8rRP3Jvw1Z1OZ2UP0FvQF57e9PeFBKVk9MVdRbHUGf6','devinarena03@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-26  3:24:13
