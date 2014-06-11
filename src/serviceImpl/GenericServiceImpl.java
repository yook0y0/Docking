package serviceImpl;

import java.io.Serializable;
import java.util.List;

import dao.generic.GenericDAO;
import dao.generic.GenericDAOImpl;
import service.GenericService;

public class GenericServiceImpl<T extends Serializable>	implements GenericService<T> 
{
	private	GenericDAO<T>	genericDAO;
	
	public GenericServiceImpl()
	{
		genericDAO = new GenericDAOImpl<T>();
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
	public void delete(String mapper, Object id) throws RuntimeException 
	{
		genericDAO.setMapper(mapper);
		genericDAO.delete(id);
	}
}
