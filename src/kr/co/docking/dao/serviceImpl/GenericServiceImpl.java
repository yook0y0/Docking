package kr.co.docking.dao.serviceImpl;

import java.io.Serializable;
import java.util.List;

import kr.co.docking.dao.generic.GenericDAO;
import kr.co.docking.dao.genericImpl.GenericDAOImpl;
import kr.co.docking.dao.service.GenericService;

public class GenericServiceImpl<T extends Serializable>	implements GenericService<T> 
{
	private	GenericDAO<T>	genericDAO;
	
	public GenericServiceImpl()
	{
		genericDAO = new GenericDAOImpl<T>();
	}

	@Override
	public void add(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.add(list);
	}

	@Override
	public void add(String mapper, T t) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.add(t);
	}

	@Override
	public void modify(String mapper, T t) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.modify(t);
	}

	@Override
	public void modify(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.modify(list);
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
	public void delete(String mapper, Object id) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.delete(id);
	}

	@Override
	public void deleteAll(String mapper, List<T> list) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.deleteAll(list);
	}

	@Override
	public void deleteAll(String mapper) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.deleteAll();
	}	
}
