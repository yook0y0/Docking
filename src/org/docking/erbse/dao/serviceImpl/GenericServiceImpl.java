package org.docking.erbse.dao.serviceImpl;

import java.io.Serializable;
import java.util.List;

import org.docking.erbse.dao.generic.GenericDAO;
import org.docking.erbse.dao.genericImpl.GenericDAOImpl;
import org.docking.erbse.dao.service.GenericService;


public class GenericServiceImpl<T extends Serializable>	implements GenericService<T> 
{
	private	GenericDAO<T>	genericDAO;
	
	public GenericServiceImpl()
	{
		genericDAO = new GenericDAOImpl<T>();
	}

	@Override
	public Integer add(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.add(list);
	}

	@Override
	public Integer add(String mapper, T t) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.add(t);
	}

	@Override
	public Integer modify(String mapper, T t) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.modify(t);
	}

	@Override
	public Integer modify(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.modify(list);
	}

	@Override
	public T search(String mapper, Object id) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.search(id);
	}

	@Override
	public List<T> searchAll(String mapper) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.searchAll();
	}

	@Override
	public List<T> searchAll(String mapper, Object id) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.searchAll(id);
	}

	@Override
	public Integer delete(String mapper, Object id) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.delete(id);
	}

	@Override
	public Integer deleteAll(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.deleteAll(list);
	}

	@Override
	public Integer deleteAll(String mapper) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		return genericDAO.deleteAll();
	}	
}
