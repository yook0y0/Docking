package org.docking.erbse.dao.generic;

import java.io.Serializable;
import java.util.List;

public interface GenericDAO<T extends Serializable> 
{
	abstract public Integer add(List<T> list);
	abstract public Integer add(T t);
	
	abstract public Integer modify(T t);
	abstract public Integer modify(List<T> list);
	
	abstract public T search(Object id);
	abstract public List<T> searchAll();
	abstract public List<T>	searchAll(Object id);
	
	abstract public Integer delete(Object id);
	abstract public Integer deleteAll(List<T> list);
	abstract public Integer deleteAll();
	
	abstract public void setMapper(String mapper);
}
