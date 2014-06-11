package dao.generic;

import java.io.Serializable;
import java.util.List;

public interface GenericDAO<T extends Serializable> 
{
	abstract public void add(T t)	throws RuntimeException;
	abstract public void modify(T t)	throws RuntimeException;
	abstract public T search(Object id)	throws RuntimeException;
	abstract public List<T> searchAll()	throws RuntimeException;
	abstract public void delete(Object id)	throws RuntimeException;
	abstract public void setMapper(String mapper);
}
