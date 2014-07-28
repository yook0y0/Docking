package kr.co.docking.dao.service;

import java.io.Serializable;
import java.util.List;

public interface GenericService<T extends Serializable> 
{
	abstract public void add(String mapper, List<T> list)	throws RuntimeException;
	abstract public void add(String mapper, T t)	throws RuntimeException;
	
	abstract public void modify(String mapper, T t)	throws RuntimeException;
	abstract public void modify(String mapper, List<T> list)	throws RuntimeException;
	
	abstract public T search(String mapper, Object id)	throws RuntimeException;
	abstract public List<T> searchAll(String mapper)	throws RuntimeException;
	abstract public List<T>	searchAll(String mapper, Object id)	throws RuntimeException;
	
	abstract public void delete(String mapper, Object id)	throws RuntimeException;
	abstract public void deleteAll(String mapper, List<T> list)	throws RuntimeException;
	abstract public void deleteAll(String mapper)	throws RuntimeException;
}
