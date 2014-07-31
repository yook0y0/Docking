package org.docking.erbse.dao.service;

import java.io.Serializable;
import java.util.List;

public interface GenericService<T extends Serializable> 
{
	abstract public Integer add(String mapper, List<T> list)	throws RuntimeException;
	abstract public Integer add(String mapper, T t)	throws RuntimeException;
	
	abstract public Integer modify(String mapper, T t)	throws RuntimeException;
	abstract public Integer modify(String mapper, List<T> list)	throws RuntimeException;
	
	abstract public T search(String mapper, Object id)	throws RuntimeException;
	abstract public List<T> searchAll(String mapper)	throws RuntimeException;
	abstract public List<T>	searchAll(String mapper, Object id)	throws RuntimeException;
	
	abstract public Integer delete(String mapper, Object id)	throws RuntimeException;
	abstract public Integer deleteAll(String mapper, List<T> list)	throws RuntimeException;
	abstract public Integer deleteAll(String mapper)	throws RuntimeException;
}
