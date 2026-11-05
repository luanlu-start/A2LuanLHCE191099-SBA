package com.fpt.funews.repository;

import com.fpt.funews.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByCategoryNameContainingIgnoreCase(String keyword);

    List<Category> findByIsActiveTrue();
}

